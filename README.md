🚗 Powered Vehicles Damaged Estimator
A Machine Learning and Deep Learning-based system that automatically detects and estimates vehicle damage from images using CNN models. This project integrates ML, backend APIs, and a React frontend for a seamless, full-stack experience.

🧠 Overview
This project helps insurance companies, automobile service centers, and individuals quickly analyze damaged vehicle images, classify damage severity, and estimate repair cost based on trained machine learning models.

⚙️ Tech Stack
Layer	Technologies
Frontend	React.js, Tailwind CSS
Backend	Node.js, Express.js
ML Backend	Python, Flask, TensorFlow, OpenCV
Database	MongoDB
🌟 Key Features
📸 Upload vehicle images for analysis
🧩 CNN model detects damaged regions
💰 Cost estimation using regression model
⚡ Confidence score based on prediction accuracy
🔗 Integrated backend & ML API communication
📱 Responsive frontend dashboard (React + Tailwind)
🧩 Project Structure
Powered-Vehicles-Damaged-Estimator/ │ ├── ml-backend/ # Flask-based ML model server (Python) │ ├── model/ # CNN model and weights │ ├── static/ # Saved images or prediction results │ ├── app.py # Main Flask API file │ └── requirements.txt │ ├── backend/ # Node.js + Express API for data & user management │ ├── routes/ │ ├── controllers/ │ ├── config/ │ └── server.js │ ├── frontend/ # React.js client for user interface │ ├── src/ │ ├── public/ │ └── package.json │ └── client/ # Optional frontend or admin panel

yaml Copy code

🚀 Run Locally
1️⃣ Clone Repository
git clone https://github.com/Jayinfo77/Powered-Vehicles-Damaged-Estimator.git
cd Powered-Vehicles-Damaged-Estimator
2️⃣ Start the ML Backend
bash
Copy code
cd ml-backend
pip install -r requirements.txt
python app.py
3️⃣ Start the Node.js Backend
bash
Copy code
cd backend
npm install
npm run dev
4️⃣ Start the Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Then open your browser at http://localhost:5173/

📈 Model Description
The Convolutional Neural Network (CNN) model is trained on a custom dataset of damaged vehicles to predict:

Damage severity level (minor / moderate / major)

Estimated repair cost range
The model’s accuracy is used to determine confidence levels in the results.

🔮 Future Enhancements
🌐 Integration with Gemini 2.0 API for real-time repair cost data

🔌 IoT-based live vehicle sensors

🧾 Report generation (PDF/CSV) for claims

🧠 Improved dataset and multi-class damage classification

🧰 .gitignore Example (for ml-backend)
bash
Copy code
venv/
__pycache__/
instance/
*.pyc
.env
🧑‍💻 Author
👤 Jay Pratap Mahatto
B.Sc.CSIT — Tribhuvan University
MERN Stack & ML Developer

GitHub: Jayinfo77

🪪 License
This project is licensed under the MIT License — feel free to use, modify, and distribute.

⭐ If you like this project, please give it a star!

yaml
Copy code
About
this is deep learning project using React+Vite,tailwindcss,Node.js,Express.js,Mongodb,python,convolutional neural network

Resources
 Readme
 Activity
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
Releases
No releases published
Create a new release
Packages
No packages published
Publish your first package
Languages
JavaScript
87.1%
 
Python
12.1%
 
Other
0.8%
Suggested workflows
Based on your tech stack
Grunt logo
Grunt
Build a NodeJS project with npm and grunt.
SLSA Generic generator logo
SLSA Generic generator
Generate SLSA3 provenance for your existing release workflows
Python application logo
Python application
Create and test a Python application.
More workflows
Footer
