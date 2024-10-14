# app/routes/__init__.py

from .auth import auth_bp
from .email import email_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(email_bp)
