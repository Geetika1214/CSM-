# app/routes/__init__.py

from .auth import auth_bp
from .email import email_bp
from .project import *
# from .user_routes import user_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(email_bp)
    # app.register_blueprint(project_bp)
    # app.register_blueprint(user_bp)
    

