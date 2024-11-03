from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Retrieve MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("No MONGO_URI found in environment variables")

# Initialize MongoDB client and select the database and collection
client = MongoClient(MONGO_URI)
db = client['pythondb']
users_collection = db.users


# Function to send verification code via email
def send_verification_email(email, code):
    sender_email = os.getenv("SENDER_EMAIL")  # Your email address
    sender_password = os.getenv("SENDER_PASSWORD")  # Your app password
    subject = "Email Verification Code"
    body = f"Your verification code is: {code}"

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())
            print(f"Verification email sent to {email} with code: {code}")  # Debug log
            return True
    except Exception as e:
        print(f"Error sending email: {e}")  # More detailed error logging
        return False

# SignUp
@app.route('/api/signup', methods=['POST'])
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
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create a new user document
        new_user = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'is_verified': False,  # Initially set to False
            'verification_code': None  # Will be set after sending the email
        }

        # Insert the new user into the database
        users_collection.insert_one(new_user)

        # Generate a random verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send the verification code via email
        if send_verification_email(email, verification_code):
            # Update the user document with the verification code
            users_collection.update_one({'email': email}, {'$set': {'verification_code': verification_code}})
            return jsonify({'message': 'User created successfully. A verification code has been sent to your email. Please verify your email to continue.'}), 201
        else:
            return jsonify({'error': 'Error sending verification code'}), 500

    except Exception as e:
        app.logger.error(f"Signup error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


# Signin Route
@app.route('/api/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'error': 'Email and password are required'}), 400

        # Find the user by email
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Check the password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid email or password'}), 401

        return jsonify({'message': 'Signed in successfully'}), 200

    except Exception as e:
        app.logger.error(f"Signin error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

# EmailVerification
@app.route('/api/emailverification', methods=['POST'])
def email_verification():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        email = data.get('email')
        verification_code = data.get('verification_code')

        # Find the user by email
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Email not found'}), 404

        # Check if the verification code matches
        if user.get('verification_code') != verification_code:
            return jsonify({'error': 'Invalid verification code'}), 400

        # If valid, mark the user as verified
        users_collection.update_one({'email': email}, {'$set': {'is_verified': True, 'verification_code': None}})

        return jsonify({'message': 'Email verified successfully'}), 200

    except Exception as e:
        app.logger.error(f"Email verification error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/api/request-email-verification', methods=['POST'])
def request_email_verification():
    try:
        data = request.get_json()
        email = data.get('email')

        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Email not found'}), 404

        # Generate a random verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send the verification code via email
        if send_verification_email(email, verification_code):
            users_collection.update_one({'email': email}, {'$set': {'verification_code': verification_code}})
            return jsonify({'message': 'Verification code sent'}), 200
        else:
            return jsonify({'error': 'Error sending verification code'}), 500

    except Exception as e:
        app.logger.error(f"Request email verification error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

# Forgot Password Route
@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.json
        email = data.get('email')

        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({"msg": "Email not found"}), 404

        # Generate a random verification code
        verification_code = ''.join(random.choices(string.digits, k=6))

        # Send the verification code via email
        if send_verification_email(email, verification_code):
            users_collection.update_one({'email': email}, {'$set': {'verification_code': verification_code}})
            return jsonify({"msg": "Verification code sent"}), 200
        else:
            return jsonify({"msg": "Error sending verification code"}), 500

    except Exception as e:
        app.logger.error(f"Forgot password error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


# Reset Password Route
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        email = data.get('email')
        verification_code = data.get('verification_code')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({"msg": "User not found"}), 404

        # Check if the verification code matches
        if user.get('verification_code') != verification_code:
            return jsonify({"msg": "Invalid verification code"}), 400

        # Check if passwords match
        if new_password != confirm_password:
            return jsonify({"msg": "Passwords do not match"}), 400

        # Hash the new password and update it in the database
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        users_collection.update_one({'email': email}, {'$set': {'password': hashed_password, 'verification_code': None}})

        return jsonify({"msg": "Password reset successful"}), 200

    except Exception as e:
        app.logger.error(f"Reset password error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/api/test-email', methods=['POST'])
def test_email():
    email = request.json.get('email')
    code = ''.join(random.choices(string.digits, k=6))  # Generate a test code
    if send_verification_email(email, code):
        return jsonify({'message': 'Test email sent successfully!'}), 200
    else:
        return jsonify({'error': 'Failed to send test email.'}), 500


# Run the application
if __name__ == '__main__':
    app.run(debug=True)
