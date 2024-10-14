# app/config.py

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    SENDER_EMAIL = os.getenv("SENDER_EMAIL")
    SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")  # Ensure a default or set in .env
    DEBUG = os.getenv("DEBUG", "False") == "True"
