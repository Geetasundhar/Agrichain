from flask import Flask, render_template, request, jsonify
import requests
import os
from werkzeug.utils import secure_filename

app = Flask(_name_)

# --- Configuration ---
WEATHER_API_KEY = "b0718e57705642b1b31163720253108"
UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Simulated Government Scheme Data ---
GOV_SCHEMES = [
    {"scheme_name": "PMFBY - Pradhan Mantri Fasal Bima Yojana", "crops": ["paddy", "wheat", "maize", "cotton", "soybean", "groundnut"]},
    {"scheme_name": "State Paddy Insurance Scheme", "crops": ["paddy"]},
    {"scheme_name": "High Yield Wheat Plan", "crops": ["wheat"]},
    {"scheme_name": "Cotton Crop Insurance", "crops": ["cotton"]},
    {"scheme_name": "Oilseed Protection Plan", "crops": ["soybean", "groundnut", "sunflower"]},
    {"scheme_name": "Horticulture Crop Insurance", "crops": ["mango", "banana", "grapes", "tomato", "potato"]},
    {"scheme_name": "Millet and Pulses Insurance", "crops": ["moong", "chickpea", "millet", "lentil"]},
    {"scheme_name": "Sugarcane Insurance Scheme", "crops": ["sugarcane"]},
    {"scheme_name": "Tea & Coffee Plantations Insurance", "crops": ["tea", "coffee"]},
    {"scheme_name": "Vegetable & Floriculture Insurance", "crops": ["cabbage", "cauliflower", "onion", "rose", "marigold"]},
]

# --- Helper: Check valid file extension ---
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Fetch weather data from WeatherAPI ---
def get_weather_data(region):
    url = f"http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={region}"
    try:
        response = requests.get(url)
        data = response.json()
        return {
            "rainfall_mm": data['current']['precip_mm'],
            "temperature_c": data['current']['temp_c']
        }
    except Exception as e:
        print("Error fetching weather data:", e)
        return {"rainfall_mm": 0, "temperature_c": 0}

# --- Recommend insurance based on inputs ---
def recommend_insurance(crop_type, loss, farm_size):
    plan = "Basic Coverage Plan"
    if loss >= 50:
        plan = "Premium Coverage Plan"
    elif loss >= 20:
        plan = "Standard Coverage Plan"

    for scheme in GOV_SCHEMES:
        if crop_type.lower() in scheme['crops']:
            plan = scheme['scheme_name']
            break
    return plan

# --- Routes ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    # --- Extract form data ---
    region = request.form.get('region')
    crop_type = request.form.get('crop_type')
    loss = float(request.form.get('loss'))
    farm_size = float(request.form.get('farm_size'))

    # --- Handle image upload ---
    image_file = request.files.get('crop_image')
    image_path = None

    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(image_path)
    else:
        print("⚠ No valid image uploaded or missing file!")

    # --- Fetch weather and recommendation ---
    weather = get_weather_data(region)
    recommended_plan = recommend_insurance(crop_type, loss, farm_size)

    # --- Simulated data ---
    avg_yield = 2000
    market_price = 30

    # --- Return JSON response for frontend ---
    return jsonify({
        "recommended_plan": recommended_plan,
        "weather": weather,
        "avg_yield": avg_yield,
        "market_price": market_price,
        "image_path": image_path  # Include image path for display if needed
    })

if _name_ == "_main_":
    app.run(debug=True)