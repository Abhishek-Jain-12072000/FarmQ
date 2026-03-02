# ☁️ AWS Deployment Guide - FarmQ

This document provides detailed instructions for deploying the FarmQ application to AWS using the following architecture:

- **Frontend**: Amazon S3 (Static Hosting) + CloudFront (CDN)
- **Backend**: FastAPI (Dockerized) + Amazon ECR + Amazon EC2 + Application Load Balancer (ALB) + CloudFront (CDN)
- **AI/ML**: Amazon Bedrock (Nova Lite/Claude) + Amazon Polly (Speech)

---

## 🛠 Prerequisites

- AWS CLI installed and configured.
- Docker installed locally.
- AWS Account with appropriate permissions (EC2, ECR, S3, CloudFront, Bedrock, Polly).
- Bedrock models enabled in your AWS region (e.g., `us-east-1`).

---

## 🏗 Backend Architecture (EC2 + ALB + CloudFront)

Deployment involves pushing the Docker container to ECR and running it on an EC2 instance behind an ALB and CloudFront for high availability and security.

### 1. Create and Push Image to ECR

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build the Docker image
cd backend
docker build -t farmq-backend .

# Tag and Push to ECR
docker tag farmq-backend:latest <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/farmq-backend:latest
docker push <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/farmq-backend:latest
```

### 2. Deploy on EC2

1. Launch an EC2 instance (Ubuntu/Amazon Linux).
2. Install Docker on the instance.
3. Pull the image from ECR:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   docker pull <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/farmq-backend:latest
   ```
4. Run the container:
   ```bash
   docker run -d -p 8000:5000 \
     -e AWS_REGION=us-east-1 \
     -e BEDROCK_MODEL_ID=amazon.nova-lite-v1:0 \
     -e AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY \
     -e AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY \
     <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/farmq-backend:latest
   ```

### 3. Load Balancer (ALB) & CloudFront

1. Create an **Application Load Balancer (ALB)** targeting the EC2 instance on port 8000.
2. Verify the ALB DNS is working.
3. Configure **CloudFront** with the ALB as the origin for the backend API.
4. Ensure CORS is correctly handled in `app.py`.

---

## 🌐 Frontend Deployment (S3 + CloudFront)

Deploying the React application as a static site.

### 1. Build and Sync

```bash
cd frontend
npm install
npm run build

# Sync build folder to S3
aws s3 sync build/ s3://farmq-frontend-<ACCOUNT_ID>
```

### 2. CloudFront Setup

1. Create a **CloudFront Distribution** choosing your S3 bucket as the origin.
2. Configure **Default Root Object** to `index.html`.
3. Update the frontend `.env` to point to the **CloudFront Backend URL**.
4. Access your app via the CloudFront URL: `https://<distribution_id>.cloudfront.net`

---

## 📝 Operational Commands

### Docker Troubleshooting
```bash
# List running containers
docker ps

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# View logs
docker logs -f <container_id>
```

### AWS ECR Login
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

---

## ⚠️ Important Notes

- **Secrets Management**: Never hardcode your `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` in the repository. Use environment variables or IAM Roles.
- **IAM Roles**: For production, it is highly recommended to use **IAM Instance Profiles** for the EC2 instance instead of passing raw credentials.
- **Region**: Ensure Bedrock and Polly are supported in your selected region.
