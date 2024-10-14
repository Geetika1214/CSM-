import React, { useState } from 'react';
import Stepper from '../Components/Stepper'; // Updated Stepper component
import UploadInputField from '../Components/uploadInputField'; // Reusable input field component
import UploadButton from '../Components/UploadButton'; // Reusable button component
import { FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaUpload, FaRedo } from 'react-icons/fa';

const FileUploadPage = () => {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleNext = () => {
    if (step < 4) {
      if (step === 1 && !fileName) return; // Validate filename step
      if (step === 2 && !file) return; // Validate file selection step
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    const uploadSuccess = Math.random() > 0.2; // Simulate success/failure
    setUploadStatus(uploadSuccess ? 'success' : 'error');
    handleNext();
  };

  const handleRetry = () => {
    setUploadStatus(null);
    setStep(2);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Upload File</h1>

        {/* Stepper with instructions */}
        <Stepper step={step} />
        
        {/* Instructions */}
        <div className="text-center text-sm text-gray-500 mb-4">
          {step === 1 && <span>Step 1: Enter a name for your file.</span>}
          {step === 2 && <span>Step 2: Select the file you want to upload.</span>}
          {step === 3 && <span>Step 3: Click submit to upload your file.</span>}
          {step === 4 && uploadStatus === 'success' && <span>Upload successful! Proceed or retry.</span>}
          {step === 4 && uploadStatus === 'error' && <span>Upload failed. Retry uploading your file.</span>}
        </div>

        {/* Step 1: Filename */}
        {step === 1 && (
          <div className="space-y-4">
            <UploadInputField
              label="Enter Filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Filename"
            />
            <UploadButton
              onClick={handleNext}
              label="Continue"
              className="bg-indigo-600 text-white w-full"
              disabled={!fileName} // Disable if filename is empty
            />
          </div>
        )}

        {/* Step 2: File Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <UploadInputField type="file" label="Select a File" onChange={handleFileUpload} />
            <div className="flex justify-between space-x-2">
              <UploadButton
                onClick={handleBack}
                label="Back"
                icon={<FaArrowLeft />}
                className="bg-gray-400 text-white"
              />
              <UploadButton
                onClick={handleNext}
                label="Continue"
                className="bg-indigo-600 text-white"
                disabled={!file} // Disable if no file selected
              />
            </div>
          </div>
        )}

        {/* Step 3: Submit */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">Click submit to upload your file</p>
            <div className="flex justify-between space-x-2">
              <UploadButton
                onClick={handleBack}
                label="Back"
                icon={<FaArrowLeft />}
                className="bg-gray-400 text-white"
              />
              <UploadButton
                onClick={handleSubmit}
                label="Submit"
                icon={<FaUpload />}
                className="bg-indigo-600 text-white"
              />
            </div>
          </div>
        )}

        {/* Step 4: Success/Retry */}
        {step === 4 && (
          <div className="text-center space-y-4">
            {uploadStatus === 'success' ? (
              <div className="text-green-600">
                <FaCheckCircle className="text-5xl mx-auto mb-4" />
                <p className="text-lg font-semibold">Upload Successful!</p>
              </div>
            ) : (
              <div className="text-red-600">
                <FaExclamationCircle className="text-5xl mx-auto mb-4" />
                <p className="text-lg font-semibold">Upload Failed</p>
                <UploadButton
                  onClick={handleRetry}
                  label="Retry"
                  icon={<FaRedo />}
                  className="bg-red-600 text-white"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPage;
