from langchain.tools import tool
from fastapi.responses import StreamingResponse
import asyncio
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import pickle
import base64
import pandas as pd
from disease import disease_dic
from fertilizer import fertilizer_dic
import requests
import torch
from langchain_core.messages import HumanMessage
from torchvision import transforms
from PIL import Image
from model import ResNet9
from fastapi import Request
from fastapi.responses import StreamingResponse
import asyncio
import os
import uuid
import json
import random
import boto3
from botocore.config import Config
from langchain_aws import ChatBedrock
from dotenv import load_dotenv
from langchain_core.messages import SystemMessage, HumanMessage
import boto3
import base64

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(override=True)

conversations = {}

WEATHER_API = "YOUR_OPENWEATHER_MAP_API"
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")

# Load disease classification model
disease_classes = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy', 'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Grape___Black_rot', 'Corn_(maize)___healthy', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Pepper,_bell___Bacterial_spot', 'Peach___healthy', 'Pepper,_bell___healthy', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Strawberry___healthy', 'Tomato___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spo', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus']
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
    api_key = WEATHER_API
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
    """Provides crop recommendations based on soil (N, P, K), temperature, humidity, pH, and rainfall.
    Input format: 'N, P, K, temperature, humidity, pH, rainfall' (e.g., '90, 42, 43, 20.8, 82, 6.5, 202').
    """
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
    """Provides fertilizer advice based on crop name and nutrient levels (N, P, K).
    Input format: 'crop_name, actual_N, actual_P, actual_K' (e.g., 'rice, 40, 20, 20').
    """
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
    """A general agricultural assistant that provides advice on farming practices, climate, and crop health."""
    response = llm.invoke([HumanMessage(content=input)])
    return response.content

def predict_image_from_path(path, model=disease_model):
    image = Image.open(path).convert("RGB")
    img = transforms.Compose([transforms.Resize(256), transforms.ToTensor()])(image)
    output = model(torch.unsqueeze(img, 0))
    return disease_classes[torch.argmax(output).item()]


def build_bedrock_llm():
    try:
        return ChatBedrock(
    model_id=BEDROCK_MODEL_ID,
    region_name=AWS_REGION,
    streaming=True,  # 🔥 ADD THIS
    model_kwargs={
        "temperature": 0.3,
        "max_tokens": 1024,
        "top_p": 0.9
    }
)
    except Exception as exc:
        raise RuntimeError(f"Unable to initialize Amazon Bedrock client: {exc}") from exc


llm = build_bedrock_llm()
tools = [general_farming_chat, get_crop_recommendation_tool, get_fertilizer_recommendation_tool]

SYSTEM_PROMPT = """You are FarmQ AI, a highly robust and helpful agricultural assistant designed for the Bharat context. 
Your goal is to support rural ecosystems, sustainability, and resource-efficient systems.
You provide advice on crop recommendation, fertilizer usage, and plant disease management.
Always consider local climate, sustainability, and practical scalability of your advice.
If asked in regional languages (Hindi, Marathi, Telugu, etc.), respond in that language to improve accessibility."""


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS Polly client
polly_client = boto3.client("polly", region_name=AWS_REGION, config=Config(retries={"max_attempts": 3}))

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

# Voice chat endpoint: text in, AI answer as audio out
@app.post("/api/voicechat")
async def voicechat(request: Request):
    payload = await request.json()
    user_text = payload.get("text")
    language = payload.get("language", "Hindi")

    print(language)

    if not user_text:
        raise HTTPException(status_code=400, detail="Missing text")
    
    # Detect input language or use the one provided
    user_lang = payload.get("language", "Hindi").capitalize()  # "English", "Hindi", etc.

    # Add language instruction in prompt
    lang_instruction = {
        "English": "Respond strictly in English.",
        "Hindi": "उत्तर हिंदी में दें।",
        # Add Marathi, Telugu, etc. as needed
    }.get(user_lang, "")

    # Generate AI text answer
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"{lang_instruction}\n{user_text}")
    ]

    ai_response = llm.invoke(messages)

    # 🔥 Extract plain text safely
    content = ai_response.content

    if isinstance(content, list):
        answer_text = "".join(
            block.get("text", "")
            for block in content
            if block.get("type") == "text"
        )
    else:
        answer_text = str(content)

    # Optional: Polly has 3000 char limit
    answer_text = answer_text[:2900]

    # 🎙 Select voice based on language
    voice_map = {
        "English": "Danielle",
        "Hindi": "Kajal",
        "Marathi": "Kajal",   # fallback to Aditi, not perfect
        "Telugu": "Kajal",    # fallback
    }

    engine_map = {
        "English": "long-form",
        "Hindi": "neural",
        "Marathi": "neural",   # fallback to Aditi, not perfect
        "Telugu": "neural",    # fallback
    }


    voice_id = voice_map.get(language, "Kajal")
    engine_id = engine_map.get(language, "neural")

    # Convert to speech using Polly
    polly_resp = polly_client.synthesize_speech(
        Text=answer_text,
        OutputFormat="mp3",
        VoiceId=voice_id,
        Engine=engine_id
    )

    audio_bytes = polly_resp["AudioStream"].read()
    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

    return JSONResponse({
        "text": answer_text,
        "audio": audio_base64
    })
    
@app.post("/farm-assistant")
async def farm_assistant_endpoint(request: Request):
    body = await request.json()
    query = body.get("query")

    async def chat_stream():
        async for chunk in llm.astream(query):
            if hasattr(chunk, "content") and chunk.content:
                yield str(chunk.content)


    return StreamingResponse(chat_stream(), media_type="text/plain")

@app.post('/api/bedrock-chat')
async def bedrock_chat(request: Request):
    payload = await request.json()
    prompt = payload.get("query") or payload.get("prompt")

    if not prompt:
        raise HTTPException(status_code=400, detail="Missing query")

    # ✅ ADD THIS BLOCK
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=prompt)
    ]

    async def generate_chunks():
        try:
            # ✅ CHANGE THIS LINE
            async for chunk in llm.astream(messages):
                if hasattr(chunk, "content") and chunk.content:
                    if isinstance(chunk.content, list):
                        for block in chunk.content:
                            if block.get("type") == "text":
                                yield block.get("text", "")
                    else:
                        yield str(chunk.content)
        except Exception as exc:
            yield f"Error: {str(exc)}"

    return StreamingResponse(generate_chunks(), media_type="text/plain")

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
    # try:
        path = (await request.json()).get('image_path')
        if not path or not os.path.exists(path):
            raise HTTPException(status_code=400, detail="Invalid image path")

        # Step 1: ML Prediction
        prediction = predict_image_from_path(path)

        # Step 2: Ask LLM for structured response
        structured_prompt = f"""
        The detected plant disease is: {prediction}.

        Provide response strictly in JSON format:

        {{
          "title": "Disease Name",
          "description": "Short explanation",
          "symptoms": ["point1", "point2"],
          "treatment": ["step1", "step2"],
          "prevention": ["tip1", "tip2"]
        }}

        Keep it practical for Indian farmers.
        Include organic options if possible.
        """

        llm_response = llm.invoke([HumanMessage(content=structured_prompt)])

        # Extract content safely
        content = llm_response.content
        if isinstance(content, list):
            text = "".join(block.get("text", "") for block in content if block.get("type") == "text")
        else:
            text = str(content)

        # Try parsing JSON from LLM
        try:
            disease_info = json.loads(text)
        except:
            # fallback if model returns markdown JSON
            import re
            match = re.search(r"\{.*\}", text, re.DOTALL)
            disease_info = json.loads(match.group()) if match else {}

        return {
            "status": "success",
            "disease": prediction,
            "disease_info": disease_info,
            "expert_insight": "Generated by Bedrock AI"
        }

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
                await websocket.send_text(json.dumps({
                    "type": "user_text_partial",
                    "text": msg.get("text", "")
                }))

            elif msg.get("type") == "asr_end":
                user_text = msg.get("text", "")
                conversations[session_id].append(f"User: {user_text}")

                prompt = "\n".join(conversations[session_id]) + "\nBot:"

                response = llm.invoke(prompt)

                # Extract text safely
                if isinstance(response.content, list):
                    txt = ""
                    for block in response.content:
                        if block.get("type") == "text":
                            txt += block.get("text", "")
                else:
                    txt = str(response.content)

                conversations[session_id].append(f"Bot: {txt}")

                full = ""
                for chunk in chunk_text(txt, 15):
                    full += chunk
                    await websocket.send_text(json.dumps({
                        "type": "agent_text_partial",
                        "text": chunk
                    }))
                    await asyncio.sleep(0.1)

                await websocket.send_text(json.dumps({
                    "type": "agent_text_final",
                    "text": full
                }))

    except WebSocketDisconnect:
        conversations.pop(session_id, None)