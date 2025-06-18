from langchain.tools import tool
from fastapi.responses import StreamingResponse
import asyncio
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
from disease import disease_dic
from fertilizer import fertilizer_dic
import requests
import torch
from langchain.schema import HumanMessage
from torchvision import transforms
from PIL import Image
from model import ResNet9
import os
import uuid
import json
import random
from langchain.memory import ConversationBufferMemory
from langchain_community.llms import LlamaCpp
from langchain.agents import initialize_agent

conversations = {}

# Load disease classification model
disease_classes = [...]  # Omitted for brevity
disease_model_path = 'models/plant_disease_model.pth'
disease_model = ResNet9(3, len(disease_classes))
disease_model.load_state_dict(torch.load(disease_model_path, map_location=torch.device('cpu')))
disease_model.eval()

# Load crop recommendation model
try:
    with open('models/RandomForest.pkl', 'rb') as f:
        crop_recommendation_model = pickle.load(f)
except Exception:
    from sklearn.ensemble import RandomForestClassifier
    crop_recommendation_model = RandomForestClassifier()
    crop_recommendation_model.predict = lambda X: np.array(['rice'])

def weather_fetch(city_name):
    api_key = "f4dd17518510eb75383bacfd52f08b44"
    base_url = "http://api.openweathermap.org/data/2.5/weather?"
    complete_url = base_url + "appid=" + api_key + "&q=" + city_name
    response = requests.get(complete_url).json()
    if response.get("cod") != "404":
        y = response["main"]
        return round(y["temp"] - 273.15, 2), y["humidity"]
    return None

def get_crop_recommendation(n, p, k, ph, rainfall, city):
    try:
        if city and (weather := weather_fetch(city)):
            temp, humidity = weather
            data = np.array([[n, p, k, temp, humidity, ph, rainfall]])
            return {"status": "success", "prediction": crop_recommendation_model.predict(data)[0]}
        return {"status": "error", "message": "Invalid city or weather data unavailable"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@tool
def get_crop_recommendation_tool(input: str) -> str:
    try:
        parts = [x.strip() for x in input.split(',')] + [""] * (7 - len(input.split(',')))
        ranges = [(0,140), (5,145), (5,205), (8,45), (10,100), (3.5,9), (20,300)]
        values = [float(x) if x and x.lower() != "nan" else round(random.uniform(*ranges[i]), 2) for i,x in enumerate(parts)]
        df = pd.DataFrame([values], columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
        return f"Recommended crop is {crop_recommendation_model.predict(df)[0]}"
    except Exception as e:
        return f"Error: {str(e)}"

@tool
def get_fertilizer_recommendation_tool(input: str) -> str:
    try:
        parts = [x.strip() for x in input.split(',')] + [""] * (4 - len(input.split(',')))
        crop = parts[0]
        if not crop:
            return "Please provide a crop name."
        values = [int(x) if x and x.lower() != "nan" else random.randint(*[(0,140),(5,145),(5,205)][i]) for i,x in enumerate(parts[1:])]
        df = pd.read_csv('Data/fertilizer.csv')
        row = df[df['Crop'].str.lower() == crop.lower()]
        if row.empty:
            return f"Crop '{crop}' not found."
        n_diff, p_diff, k_diff = row[['N','P','K']].iloc[0] - values
        max_def = max([(abs(n_diff), 'N'), (abs(p_diff), 'P'), (abs(k_diff), 'K')])[1]
        key = f"{max_def}High" if eval(f"{max_def.lower()}_diff") < 0 else f"{max_def}low"
        return fertilizer_dic.get(key, f"Advice not found for {key}")
    except Exception as e:
        return f"Error: {str(e)}"

@tool
def general_farming_chat(input: str) -> str:
    response = llm.invoke([HumanMessage(content=input)])
    return response.content

def predict_image_from_path(path, model=disease_model):
    image = Image.open(path).convert("RGB")
    img = transforms.Compose([transforms.Resize(256), transforms.ToTensor()])(image)
    output = model(torch.unsqueeze(img, 0))
    return disease_classes[torch.argmax(output).item()]

llm = LlamaCpp(model_path="models/llama-2-7b-chat.Q4_K_M.gguf", temperature=0.3, max_tokens=1024, top_p=1)
memory = ConversationBufferMemory(memory_key="chat_history")
tools = [general_farming_chat, get_crop_recommendation_tool, get_fertilizer_recommendation_tool]
agent = initialize_agent(tools, llm, agent="conversational-react-description", verbose=True, memory=memory)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/farm-assistant')
async def farm_assistant_endpoint(request: Request):
    query = (await request.json()).get('query')
    async def chat_stream():
        for word in agent.run(query).split():
            yield word + ' '
            await asyncio.sleep(0.05)
    return StreamingResponse(chat_stream(), media_type="text/plain")

@app.post('/upload-image')
async def upload_image(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    folder = "uploads"
    path = os.path.join(folder, f"{uuid.uuid4()}_{file.filename}")
    with open(path, "wb") as f:
        f.write(await file.read())
    return {"status": "success", "file_path": path}

@app.post('/disease-predict')
async def disease_prediction(request: Request):
    try:
        path = (await request.json()).get('image_path')
        if not path or not os.path.exists(path):
            raise HTTPException(status_code=400, detail="Invalid image path")
        prediction = predict_image_from_path(path)
        return {"status": "success", "disease": prediction, "disease_info": disease_dic[prediction]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def chunk_text(text, size=20):
    for i in range(0, len(text), size):
        yield text[i:i+size]

@app.websocket("/ws/voicechat")
async def voicechat(websocket: WebSocket):
    await websocket.accept()
    session_id = str(uuid.uuid4())
    conversations[session_id] = []
    try:
        while True:
            msg = json.loads(await websocket.receive_text())
            if msg.get("type") == "asr_partial":
                await websocket.send_text(json.dumps({"type": "user_text_partial", "text": msg.get("text", "")}))
            elif msg.get("type") == "asr_end":
                user_text = msg.get("text", "")
                conversations[session_id].append(f"User: {user_text}")
                prompt = "\n".join(conversations[session_id]) + "\nBot:"
                response = agent.run(prompt)
                conversations[session_id].append(f"Bot: {response}")
                full = ""
                for chunk in chunk_text(response, 15):
                    full += chunk
                    await websocket.send_text(json.dumps({"type": "agent_text_partial", "text": chunk}))
                    await asyncio.sleep(0.1)
                await websocket.send_text(json.dumps({"type": "agent_text_final", "text": full}))
    except WebSocketDisconnect:
        conversations.pop(session_id, None)
