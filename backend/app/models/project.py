# app/models/project.py

from flask import current_app
from ..extensions import mongo
from datetime import datetime

class ProjectModel:
    @staticmethod
    def create_project(title, description, files):
        """Create a new project."""
        try:
            project = {
                'title': title,
                'description': description,
                'files': files,  # List of filenames
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
        return mongo.db.projects.find_one({"_id": project_id})

    @staticmethod
    def update_project(project_id, data):
        mongo.db.projects.update_one({"_id": project_id}, {"$set": data})

    @staticmethod
    def delete_project(project_id):
        mongo.db.projects.delete_one({"_id": project_id})