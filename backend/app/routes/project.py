from flask import jsonify, request, current_app, send_from_directory
from ..models.project import ProjectModel
from flask_jwt_extended import jwt_required
from flask import jsonify, request, current_app

from . import auth_bp
import os
from werkzeug.utils import secure_filename


# Set the upload folder path
UPLOAD_FOLDER = './uploads'

# Allowed file extensions for project uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'docx' , 'xls', 'xlsx'} 

# Create the upload directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@auth_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    """Create a new project endpoint."""
    try:
        # For multipart/form-data, use request.form and request.files
        title = request.form.get('title')
        description = request.form.get('description')
        project_files = request.files.getlist('files')

        if not all([title, description]):
            current_app.logger.error('Create project failed: Project name and description are required')
            return jsonify({'error': 'Project name and description are required'}), 400

        # Save files if any and collect filenames
        file_paths = []
        for file in project_files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join('uploads', filename))
                file_paths.append(filename)
            elif file:
                current_app.logger.error('Create project failed: File type not allowed')
                return jsonify({'error': 'File type not allowed'}), 400

        # Create project in the database
        project = ProjectModel.create_project(title, description, file_paths)

        if project is None: 
            current_app.logger.error('Create project failed: Project creation returned None')
            return jsonify({'error': 'Failed to create project'}), 500

        current_app.logger.info(f"Project '{title}' created successfully")
        return jsonify({'message': 'Project created successfully', 'project': project}), 201

    except Exception as e:
        current_app.logger.error(f"Create project encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    """Get all projects endpoint."""
    try:
        # Assuming you have a ProjectModel similar to UserModel
        projects = ProjectModel.get_all_projects()
        current_app.logger.info('Retrieved all projects successfully')
        return jsonify(projects), 200
    except Exception as e:
        current_app.logger.error(f"Get projects encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


# Route to handle file upload
@auth_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    current_app.logger.info('Received a file upload request')

    if 'file' not in request.files:
        current_app.logger.error('No file part in the request')
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    # current_app.logger.info(f'Filename: {file.filename}')

    if file.filename == '':
        current_app.logger.error('No file selected for uploading')
        return jsonify({'error': 'No file selected for uploading'}), 400

    if not allowed_file(file.filename):
        current_app.logger.error('File type not allowed')
        return jsonify({'error': 'File type not allowed'}), 400    

    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    current_app.logger.info(f'File {filename} uploaded successfully')

    return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 201

# Route to handle Download
@auth_bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.isfile(file_path):
            current_app.logger.error(f'File {filename} not found')
            return jsonify({'error': 'File not found'}), 404

        return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
    except Exception as e:
        current_app.logger.error(f"Download encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500