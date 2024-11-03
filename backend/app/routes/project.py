from flask import jsonify, request, current_app, send_from_directory
from ..models.project import ProjectModel
from flask_jwt_extended import jwt_required
from flask import jsonify, request, current_app , send_file
from . import auth_bp
import os
from werkzeug.utils import secure_filename

from ..utilLogic.rfm_score import process_file

TEMP_FOLDER = './tempfile'  # Use tempfile folder for saving uploaded files
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

# @auth_bp.route('/process-file', methods=['POST'])
# @jwt_required()  # Ensure the user is authenticated
# def process_file_api():
#     current_app.logger.info('Received a file for processing')

#     if 'file' not in request.files:
#         current_app.logger.error('No file part in the request')
#         return jsonify({'error': 'No file part in the request'}), 400

#     file = request.files['file']

#     if file.filename == '':
#         current_app.logger.error('No file selected for uploading')
#         return jsonify({'error': 'No file selected for uploading'}), 400

#     # Define a temp path to save the uploaded file
#     temp_file_path = os.path.join(TEMP_FOLDER, secure_filename(file.filename))
#     file.save(temp_file_path)

#     current_app.logger.info(f'File {file.filename} uploaded successfully to {temp_file_path}')

#     # Call the process_file function with the temp file path and save the output file path
#     output_file_path = process_file(temp_file_path)

#     # Save the output file in the same 'tempfile' directory
#     output_file_name = f'processed_{secure_filename(file.filename)}'
#     output_file_full_path = os.path.join(TEMP_FOLDER, output_file_name)

#     # Open the processed file and write its contents to the new output file
#     with open(output_file_path, 'rb') as processed_file:
#         content = processed_file.read()
#     with open(output_file_full_path, 'wb') as f:
#         f.write(content)

#     return jsonify({
#         'message': 'File processed successfully',
#         'output_file_path': output_file_full_path  # Return the full path of the output file
#     }), 201

@auth_bp.route('/process-file', methods=['POST'])
@jwt_required()  # Ensure the user is authenticated
def process_file_api():
    current_app.logger.info('Selecting the latest file for processing')

    # Get a list of files in TEMP_FOLDER, filtering out any that start with "processed"
    files = [
        f for f in os.listdir(TEMP_FOLDER)
        if os.path.isfile(os.path.join(TEMP_FOLDER, f)) and not f.startswith('processed')
    ]

    if not files:
        current_app.logger.error('No valid files available in the tempfile folder')
        return jsonify({'error': 'No valid files available for processing'}), 400

    # Find the latest file based on the modification time
    latest_file = max(files, key=lambda f: os.path.getmtime(os.path.join(TEMP_FOLDER, f)))
    latest_file_path = os.path.join(TEMP_FOLDER, latest_file)
    current_app.logger.info(f'Selected file {latest_file} for processing')

    # Call the process_file function with the latest file path and save the output file path
    output_file_path = process_file(latest_file_path)

    # Save the processed file in the same 'tempfile' directory with a prefixed name
    output_file_name = f'processed_{secure_filename(latest_file)}'
    output_file_full_path = os.path.join(TEMP_FOLDER, output_file_name)

    # Open the processed file and write its contents to the new output file
    with open(output_file_path, 'rb') as processed_file:
        content = processed_file.read()
    with open(output_file_full_path, 'wb') as f:
        f.write(content)

    return jsonify({
        'message': 'File processed successfully',
        'output_file_path': output_file_full_path  # Return the full path of the output file
    }), 201

@auth_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    """Create a new project endpoint."""
    try:
        # Get JSON data (title and description only)
        data = request.get_json() or {}
        title = data.get('title')
        description = data.get('description')

        # Validate title and description
        if not all([title, description]):
            current_app.logger.error('Create project failed: Project name and description are required')
            return jsonify({'error': 'Project name and description are required'}), 400

        # Create project in the database (without file paths for now)
        project = ProjectModel.create_project(title, description)
        
        if project is None: 
            current_app.logger.error('Create project failed: Project creation returned None')
            return jsonify({'error': 'Failed to create project'}), 500

        # Log and return project object for debugging
        current_app.logger.info(f"Project object before returning: {project}")

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


# # Route to handle file upload
# @auth_bp.route('/upload', methods=['POST'])
# @jwt_required()
# def upload_file():
#     current_app.logger.info('Received a file upload request')

#     if 'file' not in request.files:
#         current_app.logger.error('No file part in the request')
#         return jsonify({'error': 'No file part in the request'}), 400

#     file = request.files['file']
#     # current_app.logger.info(f'Filename: {file.filename}')

#     if file.filename == '':
#         current_app.logger.error('No file selected for uploading')
#         return jsonify({'error': 'No file selected for uploading'}), 400

#     if not allowed_file(file.filename):
#         current_app.logger.error('File type not allowed')
#         return jsonify({'error': 'File type not allowed'}), 400    

#     # Save the file
#     filename = secure_filename(file.filename)
#     file_path = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(file_path)
#     current_app.logger.info(f'File {filename} uploaded successfully')

#     return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 201



# # Route to handle file upload
# @auth_bp.route('/upload/<project_id>', methods=['POST'])
# @jwt_required()
# def upload_file(project_id):
#     current_app.logger.info('Received a file upload request')

#     if 'file' not in request.files:
#         current_app.logger.error('No file part in the request')
#         return jsonify({'error': 'No file part in the request'}), 400

#     file = request.files['file']

#     if file.filename == '':
#         current_app.logger.error('No file selected for uploading')
#         return jsonify({'error': 'No file selected for uploading'}), 400

#     if not allowed_file(file.filename):
#         current_app.logger.error('File type not allowed')
#         return jsonify({'error': 'File type not allowed'}), 400    

#     # Save the file
#     filename = secure_filename(file.filename)
#     file_path = os.path.join(TEMP_FOLDER, filename)
#     file.save(file_path)
#     current_app.logger.info(f'File {filename} uploaded successfully')

#     # Associate the uploaded file with the project
#     update_status = ProjectModel.update_project_file(project_id, file_path)

#     if not update_status:
#         current_app.logger.error('Failed to associate file with the project')
#         return jsonify({'error': 'Failed to associate file with the project'}), 500

#     return jsonify({'message': 'File uploaded successfully', 'file_path': file_path, 'project_id': project_id}), 201
# Route to handle file upload with custom filename
# Route to handle file upload with custom filename
@auth_bp.route('/upload/<project_id>', methods=['POST'])
@jwt_required()
def upload_file(project_id):
    current_app.logger.info('Received a file upload request')

    # Get the filename from the form data
    custom_filename = request.form.get('filename')  # Assuming filename is sent as form data
    if not custom_filename:
        current_app.logger.error('No custom filename provided')
        return jsonify({'error': 'Filename is required'}), 400

    # Check if file part is in request
    if 'file' not in request.files:
        current_app.logger.error('No file part in the request')
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        current_app.logger.error('No file selected for uploading')
        return jsonify({'error': 'No file selected for uploading'}), 400

    if not allowed_file(file.filename):
        current_app.logger.error('File type not allowed')
        return jsonify({'error': 'File type not allowed'}), 400    

    # Get the original file extension
    file_extension = os.path.splitext(file.filename)[1]
    full_filename = secure_filename(f"{custom_filename}{file_extension}")

    # Save the file with the custom filename and original extension
    file_path = os.path.join(TEMP_FOLDER, full_filename)
    file.save(file_path)
    current_app.logger.info(f'File {full_filename} uploaded successfully')

    # Associate the uploaded file with the project
    update_status = ProjectModel.update_project_file(project_id, file_path)

    if not update_status:
        current_app.logger.error('Failed to associate file with the project')
        return jsonify({'error': 'Failed to associate file with the project'}), 500

    return jsonify({'message': 'File uploaded successfully', 'file_path': file_path, 'project_id': project_id}), 201

# # Route to handle Download
# @auth_bp.route('/download/<filename>', methods=['GET'])
# def download_file(filename):
#     try:
#         file_path = os.path.join(UPLOAD_FOLDER, filename)
#         if not os.path.isfile(file_path):
#             current_app.logger.error(f'File {filename} not found')
#             return jsonify({'error': 'File not found'}), 404

#         return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
#     except Exception as e:
#         current_app.logger.error(f"Download encountered an unexpected error: {e}")
#         return jsonify({'error': 'Internal Server Error'}), 500
@auth_bp.route('/download-latest', methods=['GET'])
@jwt_required()  # Optional: add if download should be restricted
def download_latest_file():
    try:
        # List files in TEMP_FOLDER that start with "processed"
        processed_files = [
            f for f in os.listdir(TEMP_FOLDER)
            if os.path.isfile(os.path.join(TEMP_FOLDER, f)) and f.startswith('processed')
        ]

        if not processed_files:
            current_app.logger.error('No processed files available for download')
            return jsonify({'error': 'No processed files available'}), 404

        # Find the latest processed file based on the modification time
        latest_processed_file = max(
            processed_files, key=lambda f: os.path.getmtime(os.path.join(TEMP_FOLDER, f))
        )
        
        current_app.logger.info(f'Selected file {latest_processed_file} for download')
        
        # Directly construct the path to the tempfile folder
        temp_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '..', 'tempfile', latest_processed_file)

        return send_file(temp_file_path, download_name=latest_processed_file, as_attachment=True)
    
    except Exception as e:
        current_app.logger.error(f"Download encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/projects/<project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Delete a project by its ID."""
    try:
        deleted = ProjectModel.delete_project(project_id)
        if not deleted:
            current_app.logger.error('Delete project failed: Project not found')
            return jsonify({'error': 'Project not found'}), 404

        current_app.logger.info(f"Project deleted successfully for project ID: {project_id}")
        return jsonify({'message': 'Project deleted successfully'}), 200

    except Exception as e:
        current_app.logger.error(f"Delete project encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/projects/<project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    """Update a project by its ID."""
    try:
        data = request.get_json() or {}
        updated = ProjectModel.update_project(project_id, data)
        if not updated:
            current_app.logger.error('Update project failed: Project not found')
            return jsonify({'error': 'Project not found'}), 404

        current_app.logger.info(f"Project updated successfully for project ID: {project_id}")
        return jsonify({'message': 'Project updated successfully'}), 200

    except Exception as e:
        current_app.logger.error(f"Update project encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_bp.route('/project/<string:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    """API endpoint to get a project by its ID."""
    try:
        # if not ObjectId.is_valid(id):
        #     return jsonify({'error': 'Invalid ID format'}), 400
        project = ProjectModel.get_project_by_id(project_id)
        if project:
            return jsonify(project), 200
        else:
            return jsonify({"error": "Project not found"}), 404
    except Exception as e:
        current_app.logger.error(f"Failed to retrieve project: {e}")
        return jsonify({"error": "Internal server error"}), 500
    

@auth_bp.route('/projects/<project_id>/description', methods=['PATCH'])
@jwt_required()
def update_project_description(project_id):
    """Update the description of a project."""
    try:
        data = request.get_json()
        new_description = data.get('description')
        
        if not new_description:
            current_app.logger.error('Description is required for update')
            return jsonify({'error': 'Description is required'}), 400

        # Update project description
        update_status = ProjectModel.update_project_description(project_id, new_description)

        if not update_status:
            current_app.logger.error('Failed to update project description')
            return jsonify({'error': 'Failed to update project description'}), 500

        return jsonify({'message': 'Project description updated successfully'}), 200

    except Exception as e:
        current_app.logger.error(f"Update project description encountered an unexpected error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
