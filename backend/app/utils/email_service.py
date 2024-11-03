# app/utils/email_service.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import os

def send_verification_email(email, code):
    # Email configuration
    sender_email = current_app.config['SENDER_EMAIL']
    sender_password = current_app.config['SENDER_PASSWORD']
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
            current_app.logger.debug(f"Verification email sent to {email} with code: {code}")
            return True
    except Exception as e:
        current_app.logger.error(f"Error sending email: {e}")
        return False