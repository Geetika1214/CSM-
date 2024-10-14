from flask import Blueprint, request, jsonify, current_app
from ..models.user import UserModel
from werkzeug.utils import secure_filename
from ..utils.email_service import send_verification_email
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
import random
import string
import bcrypt
import os

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Sample storage for projects (in-memory or can be replaced with MongoDB)
projects = []

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')

        # Basic validation
        if not all([username, email, password, confirm_password]):
            return jsonify({'error': 'All fields are required'}), 400

        if password != confirm_password:
            return jsonify({'error': 'Passwords do not match'}), 400

        # Check if user already exists
        existing_user = UserModel.find_by_email(email)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400

        # Create user
        user = UserModel.create_user(username, email, password)
        if not user:
            return jsonify({'error': 'Failed to create user'}), 500

        # Generate verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send verification email
        if send_verification_email(email, verification_code):
            UserModel.update_verification_code(email, verification_code)
            return jsonify({
                'message': 'User created successfully. A verification code has been sent to your email. Please verify your email to continue.'
            }), 201
        else:
            return jsonify({'error': 'Error sending verification code'}), 500

    except Exception as e:
        current_app.logger.error(f"Signup error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'error': 'Email and password are required'}), 400

        # Find user
        user = UserModel.find_by_email(email)
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Create a new access token
        access_token = create_access_token(identity=user['id'])

        return jsonify({'message': 'Signed in successfully', 'access_token': access_token}), 200

    except Exception as e:
        current_app.logger.error(f"Signin error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@auth_bp.route('/emailverification', methods=['POST'])
def email_verification():
    """Email verification endpoint."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        email = data.get('email')
        verification_code = data.get('verification_code')

        # Verify user
        if UserModel.verify_user(email, verification_code):
            return jsonify({'message': 'Email verified successfully'}), 200
        else:
            return jsonify({'error': 'Invalid verification code'}), 400

    except Exception as e:
        current_app.logger.error(f"Email verification error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/request-email-verification', methods=['POST'])
def request_email_verification():
    """Request email verification code endpoint."""
    try:
        data = request.get_json()
        email = data.get('email')

        user = UserModel.find_by_email(email)
        if not user:
            return jsonify({'error': 'Email not found'}), 404

        # Generate verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send verification email
        if send_verification_email(email, verification_code):
            UserModel.update_verification_code(email, verification_code)
            return jsonify({'message': 'Verification code sent'}), 200
        else:
            return jsonify({'error': 'Error sending verification code'}), 500

    except Exception as e:
        current_app.logger.error(f"Request email verification error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Forgot password endpoint."""
    try:
        data = request.get_json()
        email = data.get('email')

        user = UserModel.find_by_email(email)
        if not user:
            return jsonify({"msg": "Email not found"}), 404

        # Generate verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send verification email
        if send_verification_email(email, verification_code):
            UserModel.update_verification_code(email, verification_code)
            return jsonify({"msg": "Verification code sent"}), 200
        else:
            return jsonify({"msg": "Error sending verification code"}), 500

    except Exception as e:
        current_app.logger.error(f"Forgot password error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password endpoint."""
    try:
        data = request.get_json()
        email = data.get('email')
        verification_code = data.get('verification_code')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if not all([email, verification_code, new_password, confirm_password]):
            return jsonify({'error': 'All fields are required'}), 400

        # Check verification code
        user = UserModel.find_by_email(email)
        if not user or user.get('verification_code') != verification_code:
            return jsonify({"msg": "Invalid verification code"}), 400

        if new_password != confirm_password:
            return jsonify({"msg": "Passwords do not match"}), 400

        # Update password
        UserModel.update_password(email, new_password)

        return jsonify({"msg": "Password reset successful"}), 200

    except Exception as e:
        current_app.logger.error(f"Reset password error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    """Create a new project endpoint."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        project_name = data.get('title')
        project_description = data.get('description')
        project_files = request.files.getlist('files')

        if not all([project_name, project_description]):
            return jsonify({'error': 'Project name and description are required'}), 400

        # Save files if any
        file_paths = []
        for file in project_files:
            if file:
                filename = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                file_paths.append(filename)

        new_project = {
            'id': len(projects) + 1,
            'title': project_name,
            'description': project_description,
            'files': file_paths,
        }
        projects.append(new_project)

        return jsonify({'message': 'Project created successfully', 'project': new_project}), 201

    except Exception as e:
        current_app.logger.error(f"Create project error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    """Get all projects endpoint."""
    try:
        return jsonify(projects), 200
    except Exception as e:
        current_app.logger.error(f"Get projects error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    """Refresh JWT token endpoint."""
    current_user_id = get_jwt_identity()
    new_token = create_access_token(identity=current_user_id)
    return jsonify(access_token=new_token), 200

# Example of using jwt_required decorator
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """Protected route example."""
    return jsonify({'msg': 'This is a protected route'}), 200

#  the JWT loader decorators 
def register_jwt_handlers(jwt: JWTManager):
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({'error': 'Missing Authorization Header'}), 401

    @jwt.expired_token_loader
    def expired_token_callback():
        return jsonify({'error': 'The token has expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({'error': 'Missing or invalid JWT'}), 401