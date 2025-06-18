from langchain.tools import tool
from fastapi.responses import StreamingResponse
import asyncio
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Request

# Importing essential libraries and modules
import pickle
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from langchain.memory import ConversationBufferMemory

import numpy as np
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

conversations = {}

# ==============================================================================================

# -------------------------LOADING THE TRAINED MODELS -----------------------------------------------

# Loading plant disease classification model
disease_classes = ['Apple___Apple_scab',
                   'Apple___Black_rot',
                   'Apple___Cedar_apple_rust',
                   'Apple___healthy',
                   'Blueberry___healthy',
                   'Cherry_(including_sour)___Powdery_mildew',
                   'Cherry_(including_sour)___healthy',
                   'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
                   'Corn_(maize)___Common_rust_',
                   'Corn_(maize)___Northern_Leaf_Blight',
                   'Corn_(maize)___healthy',
                   'Grape___Black_rot',
                   'Grape___Esca_(Black_Measles)',
                   'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
                   'Grape___healthy',
                   'Orange___Haunglongbing_(Citrus_greening)',
                   'Peach___Bacterial_spot',
                   'Peach___healthy',
                   'Pepper,_bell___Bacterial_spot',
                   'Pepper,_bell___healthy',
                   'Potato___Early_blight',
                   'Potato___Late_blight',
                   'Potato___healthy',
                   'Raspberry___healthy',
                   'Soybean___healthy',
                   'Squash___Powdery_mildew',
                   'Strawberry___Leaf_scorch',
                   'Strawberry___healthy',
                   'Tomato___Bacterial_spot',
                   'Tomato___Early_blight',
                   'Tomato___Late_blight',
                   'Tomato___Leaf_Mold',
                   'Tomato___Septoria_leaf_spot',
                   'Tomato___Spider_mites Two-spotted_spider_mite',
                   'Tomato___Target_Spot',
                   'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
                   'Tomato___Tomato_mosaic_virus',
                   'Tomato___healthy']

disease_model_path = 'models/plant_disease_model.pth'
disease_model = ResNet9(3, len(disease_classes))
disease_model.load_state_dict(torch.load(
    disease_model_path, map_location=torch.device('cpu')))
disease_model.eval()

try:
    crop_recommendation_model_path = 'models/RandomForest.pkl'
    with open(crop_recommendation_model_path, 'rb') as f:
        crop_recommendation_model = pickle.load(f)
except Exception as e:
    from sklearn.ensemble import RandomForestClassifier
    print("Warning: Using fallback model due to compatibility issues with saved model")
    crop_recommendation_model = RandomForestClassifier()
    def fallback_predict(X):
        return np.array(['rice'])
    crop_recommendation_model.predict = fallback_predict

def weather_fetch(city_name):
    """
    Fetch and returns the temperature and humidity of a city
    :params: city_name
    :return: temperature, humidity
    """
    api_key = "f4dd17518510eb75383bacfd52f08b44"
    base_url = "http://api.openweathermap.org/data/2.5/weather?"

    complete_url = base_url + "appid=" + api_key + "&q=" + city_name
    response = requests.get(complete_url)
    x = response.json()

    if x["cod"] != "404":
        y = x["main"]
        temperature = round((y["temp"] - 273.15), 2)
        humidity = y["humidity"]
        return temperature, humidity
    else:
        return None

def get_crop_recommendation(nitrogen, phosphorous, potassium, ph, rainfall, city):
    """Tool to get crop recommendation based on soil parameters and location"""
    try:
        if city and weather_fetch(city):
            temperature, humidity = weather_fetch(city)
            input_data = np.array([[nitrogen, phosphorous, potassium, temperature, humidity, ph, rainfall]])
            prediction = crop_recommendation_model.predict(input_data)[0]
            return {"status": "success", "prediction": prediction}
        else:
            return {"status": "error", "message": "Invalid city or weather data unavailable"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# @tool
# def get_crop_recommendation_tool(input: str) -> str:
#     """
#     Recommends a suitable crop based on soil and weather parameters.
#     Input format: "N,P,K,temperature,humidity,ph,rainfall"
#     Example: "90,40,40,25.5,70,6.5,100"
#     """
#     try:
#         N, P, K, temperature, humidity, ph, rainfall = map(float, input.strip().split(','))
#         data = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]],
#                             columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
#         prediction = crop_recommendation_model.predict(data)[0]
#         return f"Recommended crop is {str(prediction)}"
#     except Exception as e:
#         return f"Error: {str(e)}"

import random

@tool
def get_crop_recommendation_tool(input: str) -> str:
    """
    Input format: "N,P,K,temperature,humidity,ph,rainfall"
    If any value is missing or empty, fill it with a random value within a reasonable range.
    """
    try:
        parts = [x.strip() for x in input.strip().split(',')]

        # Define reasonable ranges for each feature
        ranges = {
            0: (0, 140),    # N
            1: (5, 145),    # P
            2: (5, 205),    # K
            3: (8, 45),     # temperature in Celsius
            4: (10, 100),   # humidity in percentage
            5: (3.5, 9),    # ph
            6: (20, 300)    # rainfall in mm
        }

        # Ensure parts has length 7, pad if less
        while len(parts) < 7:
            parts.append("")

        # Replace missing or empty values with random values in range
        for i in range(7):
            if parts[i] == "" or parts[i].lower() == "nan":
                low, high = ranges[i]
                parts[i] = str(round(random.uniform(low, high), 2))

        # Convert all to float
        N, P, K, temperature, humidity, ph, rainfall = map(float, parts)

        data = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]],
                            columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
        prediction = crop_recommendation_model.predict(data)[0]
        return f"Recommended crop is {str(prediction)}"

    except Exception as e:
        return f"Error: {str(e)}"



from langchain.tools import tool
import pandas as pd
from fertilizer import fertilizer_dic

import random

@tool
def get_fertilizer_recommendation_tool(input: str) -> str:
    """
    Recommends fertilizer based on crop and soil nutrient levels.
    Input format: "crop,N,P,K" 
    Example: "rice,90,40,40"
    If N, P, or K is missing or empty, fills with random valid values.
    """
    try:
        parts = [x.strip() for x in input.strip().split(',')]

        # Pad input if missing parts
        while len(parts) < 4:
            parts.append("")

        crop = parts[0]
        # Check crop
        if not crop:
            return "Please provide a crop name."

        # Define ranges for N, P, K
        ranges = {
            1: (0, 140),  # N
            2: (5, 145),  # P
            3: (5, 205)   # K
        }

        # Fill missing or empty N, P, K with random values
        for i in range(1, 4):
            if parts[i] == "" or parts[i].lower() == "nan":
                low, high = ranges[i]
                parts[i] = str(random.randint(low, high))

        N, P, K = map(int, parts[1:4])

        df = pd.read_csv('Data/fertilizer.csv')
        row = df[df['Crop'].str.lower() == crop.lower()]
        if row.empty:
            return f"Crop '{crop}' not found in fertilizer dataset."

        nr = row['N'].iloc[0]
        pr = row['P'].iloc[0]
        kr = row['K'].iloc[0]

        n, p, k = int(nr) - N, int(pr) - P, int(kr) - K
        temp = {abs(n): "N", abs(p): "P", abs(k): "K"}
        max_def = temp[max(temp.keys())]

        key = f"{max_def}High" if eval(max_def.lower()) < 0 else f"{max_def}low"

        return fertilizer_dic.get(key, f"Fertilizer advice not found for key: {key}")
    except Exception as e:
        return f"Error in fertilizer recommendation: {str(e)}"


@tool
def general_farming_chat(input: str) -> str:
    """
    Handles general farming-related conversation or questions.
    """
    # Call the model with a properly formatted chat input
    chat_response = llm.invoke([HumanMessage(content=input)])

    # Return or print the response
    return chat_response.content

def predict_image_from_path(image_path, model=disease_model):
    """
    Predicts disease from image path
    :params: image_path
    :return: prediction (string)
    """
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.ToTensor(),
    ])
    image = Image.open(image_path)
    img_t = transform(image)
    img_u = torch.unsqueeze(img_t, 0)

    # Get predictions from model
    yb = model(img_u)
    # Pick index with highest probability
    _, preds = torch.max(yb, dim=1)
    prediction = disease_classes[preds[0].item()]
    # Retrieve the class label
    return prediction

from langchain_core.language_models import LLM
from typing import List
import google.generativeai as genai
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, AgentType

os.environ["GOOGLE_API_KEY"] = "AIzaSyCV9WNq4DfDWcMcMn3jNCrYjM54RGbQWrc"
memory = ConversationBufferMemory(memory_key="chat_history")

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite", temperature=0.3)
tools = [general_farming_chat, get_crop_recommendation_tool, get_fertilizer_recommendation_tool]
agent = initialize_agent(tools, llm, agent="conversational-react-description", verbose=True, memory=memory)

app = FastAPI()

@app.post('/farm-assistant')
async def farm_assistant_endpoint(request: Request):
    data = await request.json()
    query = data['query']

    async def chat_stream():
        result = agent.run(query)
        for word in result.split():
            yield word + ' '
            await asyncio.sleep(0.05)

    return StreamingResponse(chat_stream(), media_type="text/plain")

import json
import asyncio
from fastapi import WebSocket, WebSocketDisconnect

# Helper function to chunk text
def chunk_text(text, size=20):
    for i in range(0, len(text), size):
        yield text[i:i+size]


# API 1: Upload image
@app.post('/upload-image')
async def upload_image(file: UploadFile = File(...)):
    """API endpoint to upload an image and return its path"""
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
        
    if not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    # Create a unique filename
    filename = file.filename
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    
    # Save the file
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    
    return {"status": "success", "file_path": file_path}

# API 2: Predict disease from image path
@app.post('/disease-predict')
async def disease_prediction(request: Request):
    """API endpoint to predict disease from image path"""
    try:
        data = await request.json()
        image_path = data.get('image_path')
        
        if not image_path or not os.path.exists(image_path):
            raise HTTPException(status_code=400, detail="Invalid image path or file does not exist")
            
        prediction = predict_image_from_path(image_path)
        disease_info = disease_dic[prediction]
        
        return {"status": "success", "disease": prediction, "disease_info": disease_info}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# @app.websocket("/ws/voicechat")
# async def voicechat(websocket: WebSocket):
#     await websocket.accept()

#     user_text = ""

#     try:
#         while True:
#             # Receive message from frontend
#             message = await websocket.receive_text()
#             msg_data = json.loads(message)

#             if msg_data.get("type") == "asr_partial":
#                 # Partial user speech recognized as text
#                 partial = msg_data.get("text", "")
#                 user_text += partial

#                 # Echo back partial user text to frontend
#                 await websocket.send_text(json.dumps({
#                     "type": "user_text_partial",
#                     "text": user_text
#                 }))

#             elif msg_data.get("type") == "asr_end":
#                 # User finished speaking - call your agent on full text
#                 response = agent.run(user_text)

#                 # Stream response back in chunks
#                 for chunk in chunk_text(response, size=15):
#                     await websocket.send_text(json.dumps({
#                         "type": "agent_text_partial",
#                         "text": chunk
#                     }))
#                     await asyncio.sleep(0.1)  # small delay for streaming effect

#                 # Optionally, here you could generate TTS audio chunks
#                 # and send with type "agent_audio_chunk"

#                 # Reset user_text for next conversation turn
#                 user_text = ""

#     except WebSocketDisconnect:
#         print("WebSocket client disconnected")


# @app.websocket("/ws/voicechat")
# async def voicechat(websocket: WebSocket):
#     await websocket.accept()
#     user_text = ""

#     try:
#         while True:
#             message = await websocket.receive_text()
#             msg_data = json.loads(message)

#             if msg_data.get("type") == "asr_partial":
#                 # Just send partial back to show progress (don't accumulate)
#                 partial = msg_data.get("text", "")
#                 await websocket.send_text(json.dumps({
#                     "type": "user_text_partial",
#                     "text": partial
#                 }))

#             elif msg_data.get("type") == "asr_end":
#                 # Use only final result
#                 user_text = msg_data.get("text", "")

#                 response = agent.run(user_text)

#                 for chunk in chunk_text(response, size=15):
#                     await websocket.send_text(json.dumps({
#                         "type": "agent_text_partial",
#                         "text": chunk
#                     }))
#                     await asyncio.sleep(0.1)

#     except WebSocketDisconnect:
#         print("WebSocket client disconnected")


# @app.websocket("/ws/voicechat")
# async def voicechat(websocket: WebSocket):
#     await websocket.accept()
#     user_text = ""

#     try:
#         while True:
#             message = await websocket.receive_text()
#             msg_data = json.loads(message)

#             if msg_data.get("type") == "asr_partial":
#                 partial = msg_data.get("text", "")
#                 await websocket.send_text(json.dumps({
#                     "type": "user_text_partial",
#                     "text": partial
#                 }))

#             elif msg_data.get("type") == "asr_end":
#                 user_text = msg_data.get("text", "")
#                 response = agent.run(user_text)

#                 full_response = ""
#                 for chunk in chunk_text(response, size=15):
#                     full_response += chunk
#                     await websocket.send_text(json.dumps({
#                         "type": "agent_text_partial",
#                         "text": chunk
#                     }))
#                     await asyncio.sleep(0.1)

#                 # Send final message after all chunks
#                 await websocket.send_text(json.dumps({
#                     "type": "agent_text_final",
#                     "text": full_response
#                 }))

#     except WebSocketDisconnect:
#         print("WebSocket client disconnected")


@app.websocket("/ws/voicechat")
async def voicechat(websocket: WebSocket):
    await websocket.accept()

    session_id = str(uuid.uuid4())  # unique session per connection
    conversations[session_id] = []  # initialize history for session

    try:
        while True:
            message = await websocket.receive_text()
            msg_data = json.loads(message)

            if msg_data.get("type") == "asr_partial":
                partial = msg_data.get("text", "")
                await websocket.send_text(json.dumps({
                    "type": "user_text_partial",
                    "text": partial
                }))

            elif msg_data.get("type") == "asr_end":
                user_text = msg_data.get("text", "")

                # Append user message to history
                conversations[session_id].append(f"User: {user_text}")

                # Build prompt with full conversation history
                prompt = "\n".join(conversations[session_id]) + "\nBot:"

                # Get response from agent on full conversation context
                response = agent.run(prompt)

                # Append bot response to history
                conversations[session_id].append(f"Bot: {response}")

                full_response = ""
                for chunk in chunk_text(response, size=15):
                    full_response += chunk
                    await websocket.send_text(json.dumps({
                        "type": "agent_text_partial",
                        "text": chunk
                    }))
                    await asyncio.sleep(0.1)

                await websocket.send_text(json.dumps({
                    "type": "agent_text_final",
                    "text": full_response
                }))

    except WebSocketDisconnect:
        print(f"WebSocket client {session_id} disconnected")
        conversations.pop(session_id, None)
