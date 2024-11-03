# app/models/user.py
#yahooo baki v chla ke dekh backend ale 
from flask import current_app
from bson import ObjectId  # Ensure to import this
from ..extensions import mongo
import bcrypt
class UserModel:
    
    @staticmethod
    def find_by_email(email):
        """Find a user by email."""
        try: 
            user = current_app.db.users.find_one({'email': email})  # Changed from mongo.db to current_app.db
            if user:
                user['id'] = str(user['_id'])  # Convert ObjectId to string
            return user
        except Exception as e:
            current_app.logger.error(f"Error finding user by email: {e}")
            return None

    @staticmethod
    def create_user(username, email, password):
        """Create a new user with hashed password."""
        try: 
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            user = {
                'username': username,
                'email': email,
                'password': hashed_password,
                'is_verified': False,
                'verification_code': None
            }
            result = current_app.db.users.insert_one(user)  # Changed from mongo.db to current_app.db
            user['id'] = str(result.inserted_id)
            return user
        except Exception as e:
            current_app.logger.error(f"Error creating user: {e}")
            return None

    @staticmethod
    def update_verification_code(email, code):
        """Update the user's verification code."""
        try:
            current_app.db.users.update_one(  # Changed from mongo.db to current_app.db
                {'email': email},
                {'$set': {'verification_code': code}}
            )
        except Exception as e:
            current_app.logger.error(f"Error updating verification code: {e}")

    @staticmethod
    def verify_user(email, code):
        """Verify the user's email using the provided code."""
        try:
            user = current_app.db.users.find_one({'email': email, 'verification_code': code})  # Changed from mongo.db to current_app.db
            if user:
                current_app.db.users.update_one(  # Changed from mongo.db to current_app.db
                    {'email': email},
                    {'$set': {'is_verified': True, 'verification_code': None}}
                )
                return True
        except Exception as e:
            current_app.logger.error(f"Error verifying user: {e}")
        return False

    @staticmethod
    def update_password(email, new_password):
        """Update the user's password with a new hashed password."""
        try:
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            current_app.db.users.update_one(  # Changed from mongo.db to current_app.db
                {'email': email},
                {'$set': {'password': hashed_password, 'verification_code': None}}
            )
        except Exception as e:
            current_app.logger.error(f"Error updating password: {e}")

    # @staticmethod
    # def update_name(email, new_name):
    #     """Update the user's name."""
    #     try:
    #         current_app.db.users.update_one(
    #             {'email': email},
    #             {'$set': {'username': new_name}}  # Update the username field
    #         )
    #     except Exception as e:
    #         current_app.logger.error(f"Error updating name: {e}")
    
    @staticmethod
    def find_by_id(user_id):
        """Find a user by their unique ID."""
        try:
            user = current_app.db.users.find_one({'_id': ObjectId(user_id)})  # Query using ObjectId
            if user:
                user['id'] = str(user['_id'])  # Convert ObjectId to string
                return user
            return None
        except Exception as e:
            current_app.logger.error(f"Error finding user by ID: {e}")
            return None
    @staticmethod
    def update_name(user_id, new_name):
        """Update the user's name by user ID."""
        try:
            current_app.db.users.update_one(
                {'_id': ObjectId(user_id)},  # Find the user by their ID
                {'$set': {'username': new_name}}  # Update the username field
            )
        except Exception as e:
            current_app.logger.error(f"Error updating name: {e}")
