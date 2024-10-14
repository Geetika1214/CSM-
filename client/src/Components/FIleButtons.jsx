// Components/FileButtons.jsx
import React from "react";
import { FaUpload, FaDownload } from "react-icons/fa"; // Importing React Icons

const FileButtons = () => {
  const handleUpload = () => {
    // Your upload logic here
    alert("Upload File functionality goes here");
  };

  const handleDownload = () => {
    // Your download logic here
    alert("Download File functionality goes here");
  };

  return (
    <div className="mt-4 flex flex-col space-y-4"> {/* Stack buttons vertically */}
      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-200"
      >
        <FaUpload className="mr-2" />
        Upload File
      </button>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition duration-200"
      >
        <FaDownload className="mr-2" />
        Download File
      </button>
    </div>
  );
};

export default FileButtons;
