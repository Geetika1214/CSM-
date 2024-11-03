// src/Components/FileButtons.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { FaUpload, FaDownload } from 'react-icons/fa';
import { useNavigate,Link ,useParams} from 'react-router-dom'; // Import useNavigate

const FileButtons = ({  onUploadSuccess, uploadedFile }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const { id } = useParams(); 

  const handleUploadClick = () => {
    // Redirect to the file upload page
    navigate('/fileupload'); // Replace with your actual upload page route
  };

  const handleDownloadClick = () => {
    if (uploadedFile) {
      window.open(`http://127.0.0.1:5000/api/download/${uploadedFile}`, '_blank');
    } else {
      alert('No file available for download.');
    }  
  };

  // const handleFileUpload = async (file) => {
  //   // Your file upload logic here
  //   try {
  //     // Assuming you have a function to handle the upload
  //     const response = await uploadFile(file); // Replace this with actual file upload API call
  //     if (response.ok) {
  //       const result = await response.json();
  //       onUploadSuccess(result.fileName); // Call the onUploadSuccess handler on success
  //     } else {
  //       alert('File upload failed. Please try again.'); // Notify user of failure
  //     }
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     alert('An error occurred while uploading the file.');
  //   }
  // };

  return (
    <div className="mt-6 flex justify-center gap-4">
      <button
        onClick={handleUploadClick}
        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        aria-label="Upload Files"
      >
        <FaUpload className="mr-2" />
        Upload Files
      </button>
      
      <button
        onClick={handleDownloadClick}
        className="flex items-center bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition"
        aria-label="Download Files"
      >
        <FaDownload className="mr-2" />
        Download Files
      </button>

    </div>
  );
};

FileButtons.propTypes = {
  onUploadSuccess: PropTypes.func, // Ensure onUploadSuccess is passed
  files: PropTypes.array,
  setFiles: PropTypes.func,
  uploadedFile: PropTypes.string, 
};

export default FileButtons;
