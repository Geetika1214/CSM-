# app/models/project.py

from flask import current_app
from ..extensions import mongo
from datetime import datetime
from bson import ObjectId  

class ProjectModel:
    @staticmethod
    def create_project(title, description, files):
        """Create a new project."""
        try:
            project = {
                'title': title,
                'description': description,
                'files': files, 
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            result = mongo.db.projects.insert_one(project)
            project['id'] = str(result.inserted_id)
            return project
        except Exception as e:
            current_app.logger.error(f"Error creating project: {e}")
            return None

    @staticmethod
    def get_all_projects():
        """Retrieve all projects."""
        try:
            projects = []
            for project in mongo.db.projects.find():
                project['id'] = str(project['_id'])
                del project['_id']
                projects.append(project)
            return projects
        except Exception as e:
            current_app.logger.error(f"Error retrieving projects: {e}")
            return []

    @staticmethod
    def get_project_by_id(project_id):
        """Retrieve a project by its ID."""
        try:
            project = mongo.db.projects.find_one({"_id": ObjectId(project_id)})
            if project:
                project['id'] = str(project['_id'])  # Add the id to the response
                del project['_id']  # Remove the MongoDB _id
                return project
            return None  # Return None if not found
        except Exception as e:
            current_app.logger.error(f"Error retrieving project by ID: {e}")
            return None  # Return None on error

    @staticmethod
    def update_project(project_id, title=None, description=None, files=None):
        """Update a project by its ID."""
        try:
            update_data = {}
            if title is not None:
                update_data['title'] = title
            if description is not None:
                update_data['description'] = description
            if files is not None:
                update_data['files'] = files
            update_data['updated_at'] = datetime.utcnow()  # Update timestamp
            
            result = mongo.db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": update_data})
            return result.modified_count > 0  # Return True if modified
        except Exception as e:
            current_app.logger.error(f"Error updating project: {e}")
            return False  # Return False on error
    @staticmethod
    def delete_project(project_id):
        """Delete a project by its ID."""
        try:
            result = mongo.db.projects.delete_one({"_id": ObjectId(project_id)})
            return result.deleted_count > 0  # Return True if deleted
        except Exception as e:
            current_app.logger.error(f"Error deleting project: {e}")
            return False  # Return False on error
        