"""
Vercel serverless entry point.
Re-exports the FastAPI app from the parent directory.
"""
import sys
import os

# Add the backend root to the Python path so imports (disease, fertilizer, model, etc.) work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Change working directory to backend root so relative paths
# (e.g., 'models/plant_disease_model.pth', 'Data/fertilizer.csv') resolve correctly
os.chdir(os.path.join(os.path.dirname(__file__), ".."))

from app import app
