import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend requests

import joblib
import numpy as np

model = joblib.load("models/crop_recommendation_model.pkl")
encoder = joblib.load("models/crop_label_encoder.pkl")

@app.route('/recommend-crop', methods=['POST'])
def recommend_crop():
    data = request.json

    # Collect input (provide defaults if missing)
    n = float(data.get("nitrogen", 0))
    p = float(data.get("phosphorus", 0))
    k = float(data.get("potassium", 0))
    temperature = float(data.get("temperature", 25))
    humidity = float(data.get("humidity", 50))
    ph = float(data.get("ph", 7))
    rainfall = float(data.get("rainfall", 200))

    # Prepare input
    input_data = np.array([[n, p, k, temperature, humidity, ph, rainfall]])

    # Predict
    prediction = model.predict(input_data)
    crop_index = prediction.argmax()
    crop_name = encoder.inverse_transform([crop_index])[0]

    return jsonify({"recommendation": crop_name.capitalize()})

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os

# Load trained disease model once
MODEL_PATH = "models/disease_model/disease_model.h5"
# MODEL_PATH = "models/crop_disease_model.pth"
disease_model = load_model(MODEL_PATH)

# Get class names from your training data folder
CLASS_NAMES = ['Apple Scab Leaf', 'Apple leaf', 'Apple rust leaf', 'Bell_pepper leaf', 'Bell_pepper leaf spot', 'Blueberry leaf', 'Cherry leaf', 'Corn Gray leaf spot', 'Corn leaf blight', 'Corn rust leaf', 'Peach leaf', 'Potato leaf early blight', 'Potato leaf late blight', 'Raspberry leaf', 'Soyabean leaf', 'Squash Powdery mildew leaf', 'Strawberry leaf', 'Tomato Early blight leaf', 'Tomato Septoria leaf spot', 'Tomato leaf', 'Tomato leaf bacterial spot', 'Tomato leaf late blight', 'Tomato leaf mosaic virus', 'Tomato leaf yellow virus', 'Tomato mold leaf', 'grape leaf', 'grape leaf black rot']
@app.route('/detect-disease', methods=['POST'])
def detect_disease():

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        # Save temporarily
        filepath = os.path.join("uploads", file.filename)
        os.makedirs("uploads", exist_ok=True)
        file.save(filepath)

        # Preprocess image
        img = image.load_img(filepath, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict probabilities
        predictions = disease_model.predict(img_array)[0]

        # Get top-3 predictions
        top_indices = predictions.argsort()[-3:][::-1]  
        results = []
        for idx in top_indices:
            results.append({
                "disease": CLASS_NAMES[idx],
                "confidence": round(float(predictions[idx]) * 100, 2)
            })

        # Clean up temp file
        os.remove(filepath)

        return jsonify({"predictions": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route('/weather-forecast', methods=['POST'])
def weather_forecast():
    data = request.get_json()
    lat = data.get("lat")
    lon = data.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Latitude and Longitude required"}), 400

    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url)
        weather_data = response.json()

        if response.status_code != 200 or "main" not in weather_data:
            return jsonify({"error": "Failed to fetch weather"}), 500

        result = {
            "location": weather_data.get("name", "Unknown"),
            "temperature": weather_data["main"]["temp"],
            "humidity": weather_data["main"]["humidity"],
            "weather": weather_data["weather"][0]["description"],
            "wind_speed": weather_data["wind"]["speed"]
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/crop-rotation', methods=['POST'])
def crop_rotation():
    data = request.get_json()
    crop = data.get("crop", "Unknown")

    # 🔹 Dummy rotation logic
    rotation_map = {
        "Wheat": ["Rice", "Maize", "Pulses"],
        "Rice": ["Wheat", "Mustard", "Vegetables"],
        "Maize": ["Soybean", "Cotton", "Pulses"],
        "Soybean": ["Wheat", "Maize", "Chickpea"],
        "Cotton": ["Wheat", "Barley", "Pulses"],
        "Sugarcane": ["Wheat", "Vegetables", "Legumes"]
    }

    next_crops = rotation_map.get(crop, ["No data available"])

    return jsonify({
        "next_crops": next_crops
    })
MARKET_DATA_API_KEY = os.getenv("AGNMARKET_API_KEY")
@app.route('/profitability', methods=['POST'])
def profitability():
    data = request.get_json()
    crop = data.get("crop", "")

    url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
    params = {
        "api-key": MARKET_DATA_API_KEY,
        "format": "json",
        "limit": 10
    }
    if crop:
        params["filters[commodity]"] = crop
    
    try:
        response = requests.get(url, params=params)
        data = response.json()

        if "records" not in data or not data["records"]:
            return jsonify({"error": "No data found"}),404
        
        # Clean and format results
        results = []
        for record in data["records"]:
            results.append({
                "Market": record.get("market", "N/A"),
                "State": record.get("state", "N/A"),
                "District": record.get("district", "N/A"),
                "Commodity": record.get("commodity", "N/A"),
                "Variety": record.get("variety", "N/A"),
                "Min_Price": record.get("min_price", "N/A"),
                "Max_Price": record.get("max_price", "N/A"),
                "Modal_Price": record.get("modal_price", "N/A"),
                "Arrival_Date": record.get("arrival_date", "N/A"),
            })
        print(results)
        return jsonify({"prices": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/fertilizer', methods=['POST'])
def fertilizer():
    data = request.get_json()
    ph = float(data.get("ph", 7))
    n = float(data.get("nitrogen", 0))
    p = float(data.get("phosphorus", 0))
    k = float(data.get("potassium", 0))

    # 🔹 Dummy logic for recommendation
    if ph < 5.5:
        fertilizer = "Lime-based fertilizer"
        note = "Your soil is too acidic. Use lime to balance pH."
    elif ph > 7.5:
        fertilizer = "Sulfur-based fertilizer"
        note = "Your soil is too alkaline. Use sulfur compounds."
    elif n < 50:
        fertilizer = "Urea or Ammonium Nitrate"
        note = "Nitrogen deficiency detected. Apply nitrogen-rich fertilizer."
    elif p < 40:
        fertilizer = "DAP (Diammonium Phosphate)"
        note = "Phosphorus deficiency detected."
    elif k < 40:
        fertilizer = "MOP (Muriate of Potash)"
        note = "Potassium deficiency detected."
    else:
        fertilizer = "Balanced NPK Fertilizer"
        note = "Your soil is balanced. Maintain with standard NPK mix."

    return jsonify({"fertilizer": fertilizer, "note": note})


from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai
# --- Configure Gemini API ---
# This code block should be outside of your route, preferably near the top of the file.
# It handles the API key, just like in the standalone script.
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise KeyError("Environment variable 'GEMINI_API_KEY' not found.")
    genai.configure(api_key=api_key)
except KeyError as e:
    print(f"❌ ERROR: {e}")
    # You might want to handle this more gracefully in a production app,
    # for example, by returning a 500 error to the client.
    # For now, we'll just exit the program.
    import sys
    sys.exit(1)

# --- Your updated Flask route ---
@app.route('/chat', methods=['POST'])
def chat():
    """
    Handles a chat request, sending the user's message to the Gemini API
    and returning the model's response.
    """
    data = request.get_json()
    message = data.get("message", "")

    if not message:
        return jsonify({"reply": "Please provide a message."}), 400

    try:
        # Initialize the model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = "You are Krushi Mitra, a smart agriculture assistant integrated into an Indian government website. Respond only in plain text without any formatting such as bold, italics, or special symbols. Keep your tone simple, clear, and professional, suitable for farmers and citizens seeking agricultural guidance. Stay strictly within the scope of agriculture, government schemes, weather, soil, crops, pest control, and related topics. Do not provide unrelated information or content outside agriculture.Reply in the language the message is sent to you. "
        # Send the user's message to the model
        response = model.generate_content(prompt+message)
        
        # Check if the response is valid
        if response and response.text:
            reply = response.text
        else:
            # Handle cases where the model returns an empty or invalid response
            print("Warning: Gemini returned an empty response. Full object for debugging:", response)
            reply = "I'm sorry, I couldn't generate a response for that. Please try a different query."

    except Exception as e:
        print(f"An error occurred with the Gemini API call: {e}")
        # Return a server error response
        return jsonify({"reply": "An internal error occurred. Please try again later."}), 500

    return jsonify({"reply": reply})

#----------------------------------------------------------------------------------------------------------------

MARKET_DATA_API_KEY = os.getenv("AGNMARKET_API_KEY") 

@app.route('/market-prices', methods=['POST'])
def market_prices():
    data = request.get_json()
    crop = data.get("crop", "")
    state = data.get("state", "")
    district = data.get("district", "")

    # AGMARKNET API URL
    url = f"https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24"
    params = {
        "api-key": MARKET_DATA_API_KEY,
        "format": "json",
        "limit": 2000
    }
    if crop:
        params["filters[Commodity]"] = crop
    if state:
        params["filters[State]"] = state
    if district:
        params["filters[District]"] = district

    try:
        response = requests.get(url, params=params)
        data = response.json()

        if "records" not in data or not data["records"]:
            return jsonify({"error": "No data found"}), 404

        # Clean and format results
        results = []
        for record in data["records"]:
            results.append({
                "Market": record.get("Market", "N/A"),
                "State": record.get("State", "N/A"),
                "District": record.get("District", "N/A"),
                "Commodity": record.get("Commodity", "N/A"),
                "Variety": record.get("Variety", "N/A"),
                "Min_Price": record.get("Min_Price", "N/A"),
                "Max_Price": record.get("Max_Price", "N/A"),
                "Modal_Price": record.get("Modal_Price", "N/A"),
                "Arrival_Date": record.get("Arrival_Date", "N/A"),
            })
        return jsonify({"prices": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
