// src/Components/FileButtons.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { FaUpload, FaDownload } from 'react-icons/fa';

const FileButtons = ({ files, setFiles }) => {
  const handleUploadClick = () => {
    // Implement file upload logic
  };

  const handleDownloadClick = () => {
    // Implement file download logic
  };

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
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        aria-label="Download Files"
      >
        <FaDownload className="mr-2" />
        Download Files
      </button>
    </div>
  );
};

FileButtons.propTypes = {
  files: PropTypes.array.isRequired,
  setFiles: PropTypes.func.isRequired,
};

export default FileButtons;
