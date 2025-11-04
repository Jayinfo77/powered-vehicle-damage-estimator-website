from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import uuid
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from datetime import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
from utils.image_utils import annotate_image  # your custom utils
from utils.vehicle_data import vehicle_data, default_costs  # your custom utils
import traceback

app = Flask(__name__)
# CORS with all origins allowed, adjust as needed for production
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Paths and Setup ---
BASE_DIR = os.getcwd()
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
PREDICT_FOLDER = os.path.join(BASE_DIR, 'predicted')
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'best_damage_model.h5')
CLASS_PATH = os.path.join(BASE_DIR, 'model', 'classes.json')
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
CONFIDENCE_THRESHOLD = 0.3

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PREDICT_FOLDER, exist_ok=True)

# --- MongoDB Setup ---
# Use environment variable or config in real app
client = MongoClient("mongodb://localhost:27017/")
db = client["vehicle_damage_db"]
collection = db["predictions"]

# --- Load Model and Classes ---
model = load_model(MODEL_PATH)
with open(CLASS_PATH) as f:
    # class_labels maps int indices to string class names
    class_labels = json.load(f)
    class_labels = {int(v): k for k, v in class_labels.items()}

# --- Severity mapping for display only ---
damage_severity = {
    "scratch": "low",
    "flat_tire": "low",
    "mirror_broken": "low",
    "dent": "medium",
    "window_broken": "medium",
    "headlight_broken": "medium",
    "bumper_dent": "medium",
    "totaled": "high"
}
severity_ranges = {
    "low": "Rs 5,000 – 10,000",
    "medium": "Rs 15,000 – 30,000",
    "high": "Rs 40,000 – 80,000"
}

# --- Helpers ---
def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_damage(image_path: str):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img_array = img_to_array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)[0]
    pred_index = int(np.argmax(preds))
    damage_type = class_labels.get(pred_index, "unknown").lower().replace(" ", "_").strip()
    confidence = float(preds[pred_index])
    return damage_type, confidence

def dynamic_cost(base_cost: int, confidence: float):
    """
    Adjust cost based on confidence:
    - Below 0.6: no reliable cost estimate (return None)
    - 0.6 to 0.7: 20% discount
    - 0.7 to 0.9: base cost
    - >0.9: 10% increase
    """
    if confidence < 0.6:
        return None
    elif confidence < 0.7:
        return int(base_cost * 0.8)
    elif confidence > 0.9:
        return int(base_cost * 1.1)
    else:
        return base_cost

def convert_objectid_to_str(obj):
    if isinstance(obj, list):
        return [convert_objectid_to_str(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: convert_objectid_to_str(v) for k, v in obj.items()}
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return obj

# --- Routes ---
@app.route('/api/')
def home():
    return "✅ Vehicle Damage Estimation Server is Running"

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if 'images' not in request.files:
            return jsonify({"error": "No images found in the request"}), 400

        files = request.files.getlist('images')
        vehicle_name = request.form.get('vehicle_name', 'unknown').lower().strip()
        vehicle_model = request.form.get('vehicle_model', 'unknown').lower().strip()
        user_id = request.form.get('user')

        results = []

        for file in files[:6]:  # limit max 6 images
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_name = f"{uuid.uuid4().hex}_{filename}"
                filepath = os.path.join(UPLOAD_FOLDER, unique_name)
                file.save(filepath)

                damage_type, confidence = predict_damage(filepath)

                # Validate damage type and confidence threshold
                if confidence < CONFIDENCE_THRESHOLD or damage_type not in default_costs:
                    results.append({
                        "error": "Low confidence or unknown damage detected.",
                        "filename": filename
                    })
                    continue

                # Determine base cost from vehicle data or default costs
                cost = default_costs[damage_type]
                if vehicle_name in vehicle_data:
                    vehicle_info = vehicle_data[vehicle_name]
                    if vehicle_model in vehicle_info.get("models", []):
                        cost = vehicle_info.get("damage_costs", {}).get(damage_type, cost)

                # Adjust cost dynamically based on confidence
                adjusted_cost = dynamic_cost(cost, confidence)
                if adjusted_cost is None:
                    results.append({
                        "error": "Confidence too low for cost estimation.",
                        "filename": filename
                    })
                    continue

                severity = damage_severity.get(damage_type, "medium")
                cost_range = severity_ranges.get(severity, "Rs 10,000 – 20,000")

                annotated_filename = annotate_image(filepath, damage_type, PREDICT_FOLDER)
                annotated_url = f"{request.host_url.rstrip('/')}/api/predicted/{annotated_filename}"

                record = {
                    "vehicle_name": vehicle_name,
                    "vehicle_model": vehicle_model,
                    "image_name": unique_name,
                    "annotated_image_name": annotated_filename,
                    "damage_type": damage_type,
                    "confidence": confidence,
                    "estimated_cost": adjusted_cost,
                    "severity": severity,
                    "cost_range": cost_range,
                    "timestamp": datetime.now()
                }

                if user_id:
                    try:
                        record["user_id"] = ObjectId(user_id)
                    except Exception:
                        pass

                collection.insert_one(record)

                results.append({
                    "damage": damage_type,
                    "confidence": round(confidence * 100, 2),
                    "estimated_cost": adjusted_cost,
                    "cost_range": cost_range,
                    "annotated_image_url": annotated_url,
                    "filename": filename
                })
            else:
                results.append({
                    "error": "Invalid file format.",
                    "filename": file.filename
                })

        return jsonify({"status": "success", "results": results})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": "Prediction failed.", "details": str(e)}), 500

@app.route('/api/predicted/<filename>')
def serve_annotated_image(filename):
    return send_from_directory(PREDICT_FOLDER, filename)

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    try:
        records = list(collection.find().sort("timestamp", -1))
        processed_records = []
        for rec in records:
            rec = convert_objectid_to_str(rec)
            ts = rec.get("timestamp")
            if isinstance(ts, datetime):
                rec["timestamp"] = ts.isoformat()
            processed_records.append(rec)
        return jsonify(processed_records)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch history.", "details": str(e)}), 500

@app.route('/api/admin/predictions/<id>', methods=['DELETE'])
def delete_prediction(id):
    try:
        result = collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({"status": "success", "message": "Prediction deleted"})
        else:
            return jsonify({"status": "error", "message": "Prediction not found"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "message": "Deletion failed", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)