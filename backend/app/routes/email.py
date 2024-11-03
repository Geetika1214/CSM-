# app/routes/email.py

from flask import Blueprint, request, jsonify, current_app
from ..utils.email_service import send_verification_email
import random
import string

email_bp = Blueprint('email', __name__, url_prefix='/api')

@email_bp.route('/test-email', methods=['POST'])
def test_email():
    try:
        email = request.json.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400

        code = ''.join(random.choices(string.digits, k=6))  # Generate a test code
        if send_verification_email(email, code):
            return jsonify({'message': 'Test email sent successfully!'}), 200
        else:
            return jsonify({'error': 'Failed to send test email.'}), 500
    except Exception as e:
        current_app.logger.error(f"Test email error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
    