FarmBud: Your Smart Farming Assistant

Overview:

FarmBud is a web application designed to empower small-scale farmers by providing them with crucial data and insights to make informed decisions. By leveraging machine learning and real-time data, FarmBud aims to enhance agricultural productivity and contribute to a more sustainable future, in alignment with the UN's Sustainable Development Goal 2: Zero Hunger.[1][2][3][4][5]
This application addresses the core challenges faced by small-scale farmers, including unpredictable weather, crop diseases, and market fluctuations. By offering a suite of intelligent tools, FarmBud helps to mitigate risks and improve crop yields.

Key Features
1. Real-time Weather Updates: Integrated with the OpenWeatherMap API, FarmBud delivers current weather conditions and forecasts, enabling farmers to plan their activities accordingly.
2. Crop Disease Detection: Utilizing a Convolutional Neural Network (CNN) model, farmers can upload images of their crops to detect common diseases. The application also provides
   recommendations for fertilizers to address identified issues.
3. Crop Recommendation: Based on soil composition, the app suggests suitable crops for cultivation, optimizing the use of land and resources.
4. Soil Quality Analysis: FarmBud provides region-based soil quality information, giving farmers a better understanding of their land's health and potential.

Tech Stack:

1.FarmBud is built with a modern and robust technology stack

2.Frontend: React

3.Backend: Python (Flask)

4.Machine Learning Model: Scikit-learn / Keras (CNN)

APIs & Datasets:

1.OpenWeatherMap API

2.data.gov.in

3.Plant Village dataset (Kaggle)

Workflow:

The application follows a simple and intuitive workflow:
  1.The user interacts with the React-based frontend.
  
  2.The frontend communicates with the Flask backend to access various features.
  
  3.The backend processes requests, utilizing the machine learning model and external APIs to provide:
      
      Weather forecasts
      Crop disease analysis
      Crop and soil quality recommendations

Expected Benefits:

1.Informed Decision-Making: Optimize harvesting and selling schedules with accurate data.

2.Weather Resilience: Reduce crop losses caused by adverse weather conditions.

3.Early Disease Detection: Minimize pesticide overuse and improve overall crop health.[6]

4.Economic Growth: Increase market awareness and improve farmer incomes.

Future Scope:

The team behind FarmBud is committed to continuous improvement and plans to introduce the following enhancements:

    Automated Chatbot Support: For instant query resolution.
    Voice-Enabled Guidance: To improve accessibility for all users.
    Government Subsidy Integration: To provide farmers with easy access to financial support.


Getting Started:

To get a local copy up and running, follow these simple steps.

Prerequisites
1. npm
npm install npm@latest -g

Installation
1. Clone the repo
git clone https://github.com/mushir2004/FarmBud.git

2. Install NPM packages
npm install

3.Run the application
npm start

Contributions:

@Ghostkwebb. 

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

License
Distributed under the MIT License. See LICENSE for more information.

Contact
Project Link: https://github.com/mushir2004/FarmBud
