from flask import current_app
from datetime import datetime
from bson import ObjectId


class ProjectModel:
    @staticmethod
    def create_project(title, description):
        """Create a new project."""
        try:
            project = {
                'title': title,
                'description': description,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            # Insert the project into the MongoDB collection using current_app.db
            result = current_app.db.projects.insert_one(project)
            
            # Add 'id' to project and remove '_id' for JSON serialization
            project['id'] = str(result.inserted_id)  # Convert ObjectId to string
            project.pop('_id', None)  # Ensure _id is removed if it exists
            
            return project
        except Exception as e:
            current_app.logger.error(f"Error creating project: {e}")
            return None

    @staticmethod
    def get_all_projects():
        """Retrieve all projects."""
        try:
            projects = []
            for project in current_app.db.projects.find():
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
            project = current_app.db.projects.find_one({"_id": ObjectId(project_id)})
            if project:
                project['id'] = str(project['_id'])  # Add the id to the response
                del project['_id']  # Remove the MongoDB _id
                return project
            return None  # Return None if not found
        except Exception as e:
            current_app.logger.error(f"Error retrieving project by ID: {e}")
            return None  # Return None on error

    @staticmethod
    def update_project(project_id, data):
        """Update a project by its ID."""
        try:
            result = current_app.db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": data})
            return result.modified_count > 0  # Return True if modified
        except Exception as e:
            current_app.logger.error(f"Error updating project: {e}")
            return False  # Return False on error

    @staticmethod
    def delete_project(project_id):
        """Delete a project by its ID."""
        try:
            result = current_app.db.projects.delete_one({"_id": ObjectId(project_id)})
            return result.deleted_count > 0  # Return True if deleted
        except Exception as e:
            current_app.logger.error(f"Error deleting project: {e}")
            return False  # Return False on error

    @staticmethod
    def update_project_file(project_id, file_path):
        """Update the project with the file path."""
        try:
            # Find the project by ID
            result = current_app.db.projects.update_one(
                {"_id": ObjectId(project_id)},
                {"$set": {"file_path": file_path}}  # Update the file_path field
            )

            if result.matched_count == 0:
                current_app.logger.error(f'Project with ID {project_id} not found')
                return False  # No project was matched with the given ID

            current_app.logger.info(f'Project {project_id} updated with file path {file_path}')
            return True  # Return True if the update was successful

        except Exception as e:
            current_app.logger.error(f'Error updating project {project_id}: {e}')
            return False  # Return False on error