# Importing essential libraries and modules
import pickle
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
import numpy as np
import pandas as pd
from disease import disease_dic
from fertilizer import fertilizer_dic
import requests
import torch
from torchvision import transforms
from PIL import Image
from model import ResNet9
import os
import uuid
import json

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

# Loading crop recommendation model
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

# ==============================================================================================
# Tool functions for the AI agent

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

def get_fertilizer_recommendation(crop_name, nitrogen, phosphorous, potassium):
    """Tool to get fertilizer recommendation based on crop and soil parameters"""
    try:
        df = pd.read_csv('Data/fertilizer.csv')
        
        nr = df[df['Crop'] == crop_name]['N'].iloc[0]
        pr = df[df['Crop'] == crop_name]['P'].iloc[0]
        kr = df[df['Crop'] == crop_name]['K'].iloc[0]
        
        n = nr - nitrogen
        p = pr - phosphorous
        k = kr - potassium
        temp = {abs(n): "N", abs(p): "P", abs(k): "K"}
        max_value = temp[max(temp.keys())]
        
        if max_value == "N":
            if n < 0:
                key = 'NHigh'
            else:
                key = "Nlow"
        elif max_value == "P":
            if p < 0:
                key = 'PHigh'
            else:
                key = "Plow"
        else:
            if k < 0:
                key = 'KHigh'
            else:
                key = "Klow"
        
        response = fertilizer_dic[key]
        return {"status": "success", "recommendation": response}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ===============================================================================================
# ------------------------------------ FASTAPI APP -------------------------------------------------

app = FastAPI()

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

# API 3: Farm assistant with ReAct approach
@app.post('/farm-assistant')
async def farm_assistant(request: Request):
    """API endpoint for the farming AI assistant with ReAct approach"""
    try:
        data = await request.json()
        
        if not data or 'query' not in data:
            raise HTTPException(status_code=400, detail="No query provided")
        
        user_query = data['query'].lower()
        
        # Simple ReAct approach
        # Step 1: Analyze the query to determine intent
        crop_keywords = ['crop', 'plant', 'grow', 'cultivate', 'sow']
        fertilizer_keywords = ['fertilizer', 'fertilize', 'nutrient', 'soil health']
        
        # Step 2: Decide which tool to use
        if any(keyword in user_query for keyword in crop_keywords):
            # Extract parameters for crop recommendation
            params = {}
            param_patterns = {
                'nitrogen': r'nitrogen[:\s]+(\d+)',
                'phosphorous': r'phosphorous[:\s]+(\d+)',
                'potassium': r'potassium[:\s]+(\d+)',
                'ph': r'ph[:\s]+([\d\.]+)',
                'rainfall': r'rainfall[:\s]+([\d\.]+)',
                'city': r'city[:\s]+(\w+)'
            }
            
            import re
            for param, pattern in param_patterns.items():
                match = re.search(pattern, user_query)
                if match:
                    value = match.group(1)
                    if param in ['nitrogen', 'phosphorous', 'potassium']:
                        params[param] = int(value)
                    elif param in ['ph', 'rainfall']:
                        params[param] = float(value)
                    else:
                        params[param] = value
            
            # Step 3: Check if we have all required parameters
            required_params = ['nitrogen', 'phosphorous', 'potassium', 'ph', 'rainfall', 'city']
            missing_params = [p for p in required_params if p not in params]
            
            if missing_params:
                # Step 4: Ask for missing information
                return {
                    "status": "need_info",
                    "message": f"To recommend a crop, I need more information. Please provide: {', '.join(missing_params)}"
                }
            
            # Step 5: Use the tool with collected parameters
            result = get_crop_recommendation(
                params['nitrogen'], 
                params['phosphorous'], 
                params['potassium'], 
                params['ph'], 
                params['rainfall'], 
                params['city']
            )
            
            # Step 6: Return the result
            return {
                "status": "success",
                "tool_used": "crop_recommendation",
                "result": result
            }
            
        elif any(keyword in user_query for keyword in fertilizer_keywords):
            # Extract parameters for fertilizer recommendation
            params = {}
            param_patterns = {
                'crop_name': r'crop[:\s]+(\w+)',
                'nitrogen': r'nitrogen[:\s]+(\d+)',
                'phosphorous': r'phosphorous[:\s]+(\d+)',
                'potassium': r'potassium[:\s]+(\d+)'
            }
            
            import re
            for param, pattern in param_patterns.items():
                match = re.search(pattern, user_query)
                if match:
                    value = match.group(1)
                    if param in ['nitrogen', 'phosphorous', 'potassium']:
                        params[param] = int(value)
                    else:
                        params[param] = value
            
            # Check if we have all required parameters
            required_params = ['crop_name', 'nitrogen', 'phosphorous', 'potassium']
            missing_params = [p for p in required_params if p not in params]
            
            if missing_params:
                return {
                    "status": "need_info",
                    "message": f"To recommend fertilizer, I need more information. Please provide: {', '.join(missing_params)}"
                }
            
            result = get_fertilizer_recommendation(
                params['crop_name'], 
                params['nitrogen'], 
                params['phosphorous'], 
                params['potassium']
            )
            
            return {
                "status": "success",
                "tool_used": "fertilizer_recommendation",
                "result": result
            }
        
        else:
            # General farming query
            return {
                "status": "info",
                "message": "I can help with crop recommendations and fertilizer advice. Please provide the necessary information like nitrogen, phosphorous, potassium levels, pH, rainfall, and city for crop recommendations, or crop name and soil nutrient levels for fertilizer advice."
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
import json
import asyncio
from fastapi import WebSocket, WebSocketDisconnect

conversations = {}

# Helper function to chunk text
def chunk_text(text, size=20):
    for i in range(0, len(text), size):
        yield text[i:i+size]


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
