# app/models/user.py

from flask import current_app
import bcrypt

class UserModel:
    @staticmethod
    def get_collection():
        if not hasattr(current_app, 'db'):
            current_app.logger.error("Database not initialized.")
            return None
        return current_app.db.users

    @staticmethod
    def find_by_email(email):
        collection = UserModel.get_collection()
        if collection is not None:
            user = collection.find_one({'email': email})
        if user:
            # Ensure that the user object includes the _id
            user['id'] = str(user['_id'])  # Convert ObjectId to string for easier handling
            return user
        return None

    @staticmethod
    def create_user(username, email, password):
        collection = UserModel.get_collection()
        if collection is not None:
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            user = {
                'username': username,
                'email': email,
                'password': hashed_password,
                'is_verified': False,
                'verification_code': None
            }
            collection.insert_one(user)
            return user
        return None

    @staticmethod
    def verify_user(email, verification_code):
        collection = UserModel.get_collection()
        if collection is not None:
            user = collection.find_one({'email': email})
            if user and user.get('verification_code') == verification_code:
                collection.update_one(
                    {'email': email},
                    {'$set': {'is_verified': True, 'verification_code': None}}
                )
                return True
        return False

    @staticmethod
    def update_verification_code(email, code):
        collection = UserModel.get_collection()
        if collection is not None:
            collection.update_one(
                {'email': email},
                {'$set': {'verification_code': code}}
            )

    @staticmethod
    def update_password(email, new_password):
        collection = UserModel.get_collection()
        if collection is not None:
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            collection.update_one(
                {'email': email},
                {'$set': {'password': hashed_password, 'verification_code': None}}
            )
