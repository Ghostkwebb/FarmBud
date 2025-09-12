from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load("../crop_recommendation_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Create a DataFrame from the input data
    df = pd.DataFrame([data])
    
    # Make prediction
    prediction = model.predict(df)
    
    # Return the prediction as JSON
    return jsonify({'crop': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)