FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Run the application
CMD uvicorn app:app --host=0.0.0.0 --port=${PORT:-5000}