# app/extensions.py

from pymongo import MongoClient
from flask_pymongo import PyMongo

# Initialize PyMongo
mongo = PyMongo()

def initialize_extensions(app):
    try:
        app.logger.info(f"Initializing MongoDB with URI: {app.config['MONGO_URI']}")
        client = MongoClient(app.config['MONGO_URI'])
        db = client['pythondb']
        app.db = db  # Attach db to the app instance for easy access
        app.logger.info("MongoDB initialized successfully.")
    except Exception as e:
        app.logger.error(f"Failed to initialize MongoDB: {e}")
        raise e
