# app/routes/auth.py
from flask import Flask, jsonify
from flask import Blueprint, request, jsonify, current_app
from ..models.user import UserModel
from ..utils.email_service import send_verification_email
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity, 
    JWTManager
)
import random
import string
import re
import bcrypt
from mongoengine.errors import DoesNotExist


auth_bp = Blueprint('auth', __name__, url_prefix='/api') 




@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data:
            current_app.logger.error('Signup failed: No input data provided')
            return jsonify({'error': 'No input data provided'}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')

        # Basic validation
        if not all([username, email, password, confirm_password]):
            missing_fields = [field for field in ['username', 'email', 'password', 'confirmPassword'] if not data.get(field)]
            current_app.logger.error(f"Signup failed: Missing fields - {', '.join(missing_fields)}")
            return jsonify({'error': f"Missing fields: {', '.join(missing_fields)}"}), 400

        if password != confirm_password:
            current_app.logger.error('Signup failed: Passwords do not match')
            return jsonify({'error': 'Passwords do not match'}), 400

        if len(password) < 6:
            current_app.logger.error('Signup failed: Password too short')
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400

        # Email format validation
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            current_app.logger.error('Signup failed: Invalid email format')
            return jsonify({'error': 'Invalid email format'}), 400

        # Check if user already exists
        existing_user = UserModel.find_by_email(email)
        if existing_user:
            current_app.logger.error('Signup failed: User already exists')
            return jsonify({'error': 'User already exists'}), 400
        else:
            print("yo")
            
        # Create user
        user = UserModel.create_user(username, email, password)
        if not user:
            current_app.logger.error('Signup failed: User creation unsuccessful')
            return jsonify({'error': 'Failed to create user'}), 500

        # Generate verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send verification email
        if send_verification_email(email, verification_code):
            UserModel.update_verification_code(email, verification_code)
            current_app.logger.info(f"Signup successful: Verification email sent to {email}")
            return jsonify({
                'message': 'User created successfully. A verification code has been sent to your email. Please verify your email to continue.'
            }), 201
        else:
            current_app.logger.error('Signup failed: Error sending verification email')
            return jsonify({'error': 'Error sending verification code'}), 500

    except Exception as e:
        current_app.logger.error(f"Signup encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            current_app.logger.error('Signin failed: Email and password are required')
            return jsonify({'error': 'Email and password are required'}), 400

        user = UserModel.find_by_email(email)
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            current_app.logger.error('Signin failed: Invalid email or password')
            return jsonify({'error': 'Invalid email or password'}), 401

        # Check if user email is verified
        if not user.get('is_verified'):
            current_app.logger.error('Signin failed: Email not verified')
            return jsonify({'error': 'Email not verified. Please verify your email before signing in.'}), 401

        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])  # Include refresh token

        current_app.logger.info(f"Signin successful: User {email} logged in")
        return jsonify({
            'message': 'Signed in successfully',
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    except Exception as e:
        current_app.logger.error(f"Signin encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/emailverification', methods=['POST'])
def email_verification():
    """Email verification endpoint."""
    try:
        data = request.get_json()
        if not data:
            current_app.logger.error('Email verification failed: No input data provided')
            return jsonify({'error': 'No input data provided'}), 400

        email = data.get('email')
        verification_code = data.get('verification_code')

        if not all([email, verification_code]):
            current_app.logger.error('Email verification failed: Missing fields')
            return jsonify({'error': 'Email and verification code are required'}), 400

        # Verify user
        if UserModel.verify_user(email, verification_code):
            current_app.logger.info(f"Email verification successful for {email}")
            return jsonify({'message': 'Email verified successfully'}), 200
        else:
            current_app.logger.error('Email verification failed: Invalid verification code')
            return jsonify({'error': 'Invalid verification code'}), 400

    except Exception as e:
        current_app.logger.error(f"Email verification encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/request-email-verification', methods=['POST'])
def request_email_verification():
    """Request email verification code endpoint."""
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            current_app.logger.error('Request email verification failed: Email is required')
            return jsonify({'error': 'Email is required'}), 400

        user = UserModel.find_by_email(email)
        if not user:
            current_app.logger.error('Request email verification failed: Email not found')
            return jsonify({'error': 'Email not found'}), 404

        # Generate verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send verification email
        if send_verification_email(email, verification_code):
            UserModel.update_verification_code(email, verification_code)
            current_app.logger.info(f"Verification code re-sent to {email}")
            return jsonify({'message': 'Verification code sent'}), 200
        else:
            current_app.logger.error('Request email verification failed: Error sending verification code')
            return jsonify({'error': 'Error sending verification code'}), 500

    except Exception as e:
        current_app.logger.error(f"Request email verification encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Forgot password endpoint."""
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            current_app.logger.error('Forgot password failed: Email is required')
            return jsonify({"error": "Email is required"}), 400

        user = UserModel.find_by_email(email)
        if not user:
            current_app.logger.error('Forgot password failed: Email not found')
            return jsonify({"error": "Email not found"}), 404

        # Generate verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send verification email
        if send_verification_email(email, verification_code):
            UserModel.update_verification_code(email, verification_code)
            current_app.logger.info(f"Forgot password: Verification code sent to {email}")
            return jsonify({"message": "Verification code sent"}), 200
        else:
            current_app.logger.error('Forgot password failed: Error sending verification code')
            return jsonify({"error": "Error sending verification code"}), 500

    except Exception as e:
        current_app.logger.error(f"Forgot password encountered an unexpected error: {e}")
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
            missing_fields = [field for field in ['email', 'verification_code', 'new_password', 'confirm_password'] if not data.get(field)]
            current_app.logger.error(f"Reset password failed: Missing fields - {', '.join(missing_fields)}")
            return jsonify({'error': f"Missing fields: {', '.join(missing_fields)}"}), 400

        if new_password != confirm_password:
            current_app.logger.error('Reset password failed: Passwords do not match')
            return jsonify({"error": "Passwords do not match"}), 400

        if len(new_password) < 6:
            current_app.logger.error('Reset password failed: Password too short')
            return jsonify({"error": "Password must be at least 6 characters long"}), 400

        # Check verification code
        user = UserModel.find_by_email(email)
        if not user or user.get('verification_code') != verification_code:
            current_app.logger.error('Reset password failed: Invalid verification code')
            return jsonify({"error": "Invalid verification code"}), 400

        # Update password
        UserModel.update_password(email, new_password)
        current_app.logger.info(f"Password reset successful for {email}")
        return jsonify({"message": "Password reset successful"}), 200

    except Exception as e:
        current_app.logger.error(f"Reset password encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


# @auth_bp.route('/token/refresh', methods=['POST'])
# @jwt_required(refresh=True)
# def refresh_token():
#     """Refresh JWT token endpoint."""
#     try:
#         current_user_id = get_jwt_identity()
#         new_access_token = create_access_token(identity=current_user_id)
#         current_app.logger.info(f"Access token refreshed for user ID: {current_user_id}")
#         return jsonify({'access_token': new_access_token}), 200
#     except Exception as e:
#         current_app.logger.error(f"Token refresh encountered an unexpected error: {e}")
#         return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    try:
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        current_app.logger.info(f"Access token refreshed for user ID: {current_user_id}")
        return jsonify({'access_token': new_access_token}), 200
    except ExpiredSignatureError:  # Handle expired refresh token
        return jsonify({'error': 'Refresh token expired'}), 401
    except Exception as e:
        current_app.logger.error(f"Token refresh encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """Protected route example."""
    try:
        current_user_id = get_jwt_identity()
        current_app.logger.info(f"Protected route accessed by user ID: {current_user_id}")
        return jsonify({'msg': 'This is a protected route'}), 200
    except Exception as e:
        current_app.logger.error(f"Protected route encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    

# Route to update profile
@auth_bp.route('/account', methods=['GET', 'PUT'])
@jwt_required()
def account():
    try:
        current_user_id = get_jwt_identity()  # Get user ID from the token
        user = UserModel.find_by_id(current_user_id)  # Ensure this method retrieves user by ID
        
        if request.method == 'GET':
            if user:
                return jsonify({"user": {
                    "email": user['email'],
                    "name": user['username'],
                    "is_verified": user['is_verified']  # Include any other relevant fields
                }}), 200
            else:
                return jsonify({"message": "User not found"}), 404
        
        if request.method == 'PUT':
            data = request.get_json()
            if not data or 'name' not in data:
                return jsonify({"message": "Invalid data provided"}), 400

            name = data.get('name')
            UserModel.update_name(current_user_id, name)  # Assuming this uses user ID
            return jsonify({"message": "User updated successfully"}), 200
    
    except Exception as e:
        current_app.logger.error(f"Internal Server Error: {e}")
        return jsonify({"message": "Internal Server Error"}), 500

# Register JWT Handlers
def register_jwt_handlers(jwt: JWTManager):
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({'error': 'Missing Authorization Header'}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'The token has expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401

    @jwt.needs_fresh_token_loader
    def needs_fresh_token_callback():
        return jsonify({'error': 'Fresh token required'}), 401
