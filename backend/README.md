# FarmQ API

A FastAPI application for farm management and crop recommendations.

## Features

- Crop recommendation based on soil parameters and location
- Fertilizer recommendation based on crop and soil parameters
- Plant disease detection from images

## Deployment with Docker

### Prerequisites

- Docker and Docker Compose installed on your system

### Steps to Deploy

1. Clone the repository:
   ```
   git clone <repository-url>
   cd FarmQ
   ```

2. Build and start the Docker container:
   ```
   docker-compose up -d
   ```

3. The API will be available at `http://localhost:8000`

### API Endpoints

- `POST /upload-image`: Upload an image file
- `POST /disease-predict`: Predict disease from an uploaded image
- `POST /farm-assistant`: Get farming assistance based on your query

## Development

### Running Locally

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   uvicorn app:app --reload
   ```

### API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`