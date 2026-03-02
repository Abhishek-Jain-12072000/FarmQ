# 🌾 FarmQ: AI-Powered Smart Farming Assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

FarmQ is a comprehensive, AI-driven platform designed to empower farmers with real-time insights, disease detection, and personalized recommendations. By leveraging cutting-edge AI models from **Amazon Bedrock** and **computer vision**, FarmQ helps improve crop yields and promote sustainable farming practices.

---

## 🚀 Key Features

- 📸 **Plant Disease Detection** – Instant diagnosis of plant diseases via image upload or live camera capture using a custom ResNet9 model.
- 🌿 **Smart Fertilization** – Tailored fertilizer suggestions based on soil composition (N-P-K) and specific crop needs.
- 🎤 **Voice-First Interaction** – A multilingual AI assistant powered by **Amazon Bedrock (Nova Lite)** and **Amazon Polly** for hands-free queries.
- 🌾 **Crop Recommendation** – Intelligent analytics to suggest the most suitable crops for your soil and climate.
- 💬 **Streaming AI Chat** – Real-time, low-latency conversational interface for general agricultural advice.

---

## � Tech Stack

### Frontend & UI
- **React.js** – Modern, responsive single-page application.
- **Framer Motion** – Smooth animations and premium UX.
- **Lucide React** – Clean, modern iconography.

### Backend & AI
- **FastAPI** – High-performance asynchronous Python backend.
- **Amazon Bedrock** – Utilizing `amazon.nova-lite-v1:0` for intelligent reasoning.
- **Amazon Polly** – Neural text-to-speech for vocal responses.
- **PyTorch/ResNet9** – Deep learning for plant disease classification.
- **Scikit-learn** – Machine learning for crop and fertilizer logic.

### Infrastructure (AWS)
- **Frontend Hosting**: Amazon S3 + CloudFront.
- **Backend Deployment**: Dockerized FastAPI on Amazon EC2 + Application Load Balancer (ALB) + CloudFront.
- **Registry**: Amazon Elastic Container Registry (ECR).

---

## 📦 Local Installation

### 1. Clone & Navigate
```bash
git clone https://github.com/Abhishek-Jain-12072000/FarmQ.git
cd FarmQ
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Environment Variables (Create a .env file)
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
export BEDROCK_MODEL_ID=amazon.nova-lite-v1:0

uvicorn app:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## ☁️ Deployment

For detailed instructions on deploying FarmQ to AWS (EC2, S3, CloudFront, ALB), please refer to our **[AWS Deployment Guide](AWS_DEPLOY.md)**.

---

## 🛡 Security & Best Practices
- **Secrets**: This project uses environment variables for AWS credentials. **Never** commit your `.env` file or hardcoded keys to GitHub.
- **IAM**: Always use IAM Roles/Instance Profiles in production instead of root access keys.






