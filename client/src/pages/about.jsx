import React from 'react';
import Workspace from '../Components/Workspace';
import UploadButton from '../Components/UploadButton';
import UploadInputField from '../Components/UploadInputField';
// Import other necessary components if needed

export default function About() {
  const handleUploadClick = () => {
    // Define your upload logic here
    console.log('Upload button clicked');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">About Us</h1>
      <p className="text-gray-600 mb-4">
        This project aims to provide a comprehensive solution for users to manage their resources efficiently. 
        Our team is dedicated to enhancing user experience and providing top-notch service.
      </p>

      {/* Optional Upload Input for feedback or related data */}
      <UploadInputField 
        label="Share your thoughts" 
        value="" 
        onChange={() => {}} 
        placeholder="Enter your feedback" 
        id="feedback" 
      />

      <UploadButton 
        label="Submit Feedback" 
        onClick={handleUploadClick} 
        className="bg-blue-500 text-white" 
      />

      {/* Workspace for displaying project-related files */}
      <Workspace />

      {/* Other components can be added here if relevant */}
    </div>
  );
}
