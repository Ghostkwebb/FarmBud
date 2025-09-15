from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import tensorflow as tf
from keras.utils import load_img, img_to_array
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# --- CROP RECOMMENDATION MODEL ---
crop_model = joblib.load("../Models/crop_recommendation_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    df = pd.DataFrame([data])
    prediction = crop_model.predict(df)
    return jsonify({'crop': prediction[0]})


# --- DISEASE DETECTION MODEL ---
disease_model = tf.keras.models.load_model('../Models/plant_disease_model.h5')
fertilizer_df = pd.read_csv('../Models/disease_fertilizer.csv')
disease_class_names = [ # Renamed to be specific
    'Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight',
    'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite', 'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus', 'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

def get_fertilizer_recommendation(disease_name):
    row = fertilizer_df[fertilizer_df['Disease'] == disease_name]
    if not row.empty:
        fert_1 = row.iloc[0]['Fertilizer_1']
        fert_2 = row.iloc[0]['Fertilizer_2']
        notes = row.iloc[0]['Notes']
        recommendations = []
        if pd.notna(fert_1) and fert_1.lower() != 'none': recommendations.append(fert_1)
        if pd.notna(fert_2) and fert_2.lower() != 'none': recommendations.append(fert_2)
        fertilizer_string = " or ".join(recommendations) if recommendations else "None"
        notes_string = notes if pd.notna(notes) else ""
        if "healthy" in disease_name.lower():
            fertilizer_string = "None needed"
            notes_string = "The plant is healthy, so no treatment is required. Continue with regular care."
        return {"fertilizers": fertilizer_string, "notes": notes_string}
    return {"fertilizers": "Unknown", "notes": "No recommendation available for this condition."}

@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    file = request.files.get('file')
    if not file: return jsonify({'error': 'No file part'}), 400
    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img = img.resize((150, 150))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        predictions = disease_model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class_name = disease_class_names[predicted_class_index]
        confidence = float(np.max(predictions[0]))
        recommendation_obj = get_fertilizer_recommendation(predicted_class_name)
        return jsonify({
            'disease': predicted_class_name.replace('___', ' ').replace('_', ' '),
            'confidence': f"{confidence*100:.2f}%",
            'recommendation': recommendation_obj
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- NEW: SOIL QUALITY MODEL ---
soil_model = tf.keras.models.load_model('../soil_cnn.h5')
soil_class_names = [ # Alphabetical order to match the training generator
    'Alluvial_Soil', 'Arid_Soil', 'Black_Soil', 'Laterite_Soil',
    'Mountain_Soil', 'Red_Soil', 'Yellow_Soil'
]
SOIL_NUTRIENT_DATA = {
    'Alluvial_Soil': {"Nitrogen": 85, "Phosphorus": 45, "Potassium": 40, "ph": 7.2},
    'Arid_Soil': {"Nitrogen": 30, "Phosphorus": 35, "Potassium": 55, "ph": 8.0},
    'Black_Soil': {"Nitrogen": 65, "Phosphorus": 35, "Potassium": 60, "ph": 7.6},
    'Laterite_Soil': {"Nitrogen": 40, "Phosphorus": 25, "Potassium": 35, "ph": 5.8},
    'Mountain_Soil': {"Nitrogen": 55, "Phosphorus": 30, "Potassium": 30, "ph": 6.2},
    'Red_Soil': {"Nitrogen": 50, "Phosphorus": 30, "Potassium": 38, "ph": 6.8},
    'Yellow_Soil': {"Nitrogen": 55, "Phosphorus": 35, "Potassium": 42, "ph": 6.5}
}

@app.route('/predict_soil', methods=['POST'])
def predict_soil():
    file = request.files.get('file')
    if not file: return jsonify({'error': 'No file part'}), 400
    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img = img.resize((150, 150))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        predictions = soil_model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])
        predicted_class_name = soil_class_names[predicted_class_index]
        confidence = float(np.max(predictions[0]))
        
        # Look up the nutrient data
        nutrient_data = SOIL_NUTRIENT_DATA.get(predicted_class_name, {})

        return jsonify({
            'soil_type': predicted_class_name.replace('_', ' '),
            'confidence': f"{confidence*100:.2f}%",
            'nutrients': nutrient_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)