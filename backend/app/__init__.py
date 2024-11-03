# app/__init__.py

from flask import Flask
from .config import Config
from .extensions import initialize_extensions, mongo
from flask_jwt_extended import JWTManager
import os
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

def setup_logging(app: Flask) -> None:
    """Set up logging for the application."""
    if not os.path.exists('app/logs'):
        os.makedirs('app/logs')
    
    file_handler = RotatingFileHandler('app/logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)

    app.logger.setLevel(logging.INFO)
    app.logger.info('Application startup')

def create_app() -> Flask:
    """Create and configure the Flask app."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    initialize_extensions(app)

    # Configure JWT
    jwt = JWTManager(app)

    # Register routes
    from .routes import register_routes
    register_routes(app)

    # Register JWT handlers
    from .routes.auth import register_jwt_handlers
    register_jwt_handlers(jwt)

    # Setup logging
    setup_logging(app)

    # Conditional Error Handlers
    if not app.config['DEBUG']:
        from flask import jsonify

        @app.errorhandler(404)
        def not_found(error):
            return jsonify({'error': 'Not Found'}), 404

        @app.errorhandler(500)
        def internal_error(error):
            return jsonify({'error': 'Internal Server Error'}), 500

    return app
