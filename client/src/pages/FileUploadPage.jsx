import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stepper from '../Components/Stepper';
import UploadInputField from '../Components/UploadInputField';
import UploadButton from '../Components/UploadButton';
import { FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaUpload, FaRedo } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const FileUploadPage = () => {
  const navigate = useNavigate(); 
  const { id } = useParams(); 
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleNext = () => {
    if (step < 4) {
      if (step === 1 && !fileName) return; // Validate filename step
      setStep(step + 1);
    }
  };

  const allowedFile = (fileName) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf|\.xls|\.xlsx)$/i;
    return allowedExtensions.test(fileName);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && !allowedFile(selectedFile.name)) {
      setUploadStatus('error');
      return alert('Invalid file type. Please select a valid file.');
    }
    setFile(selectedFile);
    console.log('Selected file:', selectedFile);

    // Process Excel file
    if (selectedFile && /\.(xls|xlsx)$/i.test(selectedFile.name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Excel data:', jsonData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', fileName); 

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/upload/${id}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('File uploaded successfully:', result);
        setUploadStatus('success');
        setUploadedFile(result.fileName);
        setStep(4); // Move to step 4 on successful upload
      } else if (response.status === 401) {
        const errorText = await response.text();
        console.error('Upload failed', errorText);
        localStorage.removeItem('access_token');
        alert("Session expired. Please log in again.");
        setUploadStatus('error');
      } else {
        const errorText = await response.text();
        console.error('Upload failed', errorText);
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      setUploadStatus('error');
    }
  };

  const handleRetry = () => {
    setUploadStatus(null);
    setFile(null);
    setStep(2);
  };

  const handleGoToProject = () => {
    navigate(`/project/${id}`); // Navigate to project details page after upload
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Upload File</h1>

        <Stepper step={step} />
        
        <div className="text-center text-sm text-gray-500 mb-4">
          {step === 1 && <span>Step 1: Enter a name for your file.</span>}
          {step === 2 && <span>Step 2: Select the file you want to upload.</span>}
          {step === 3 && <span>Step 3: Click submit to upload your file.</span>}
          {step === 4 && uploadStatus === 'success' && <span>Upload successful! Proceed to view your project.</span>}
          {step === 4 && uploadStatus === 'error' && <span>Upload failed. Retry uploading your file.</span>}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <UploadInputField
              label="Enter Filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Filename"
              id="file-name"
              required
            />
            <UploadButton
              onClick={handleNext}
              label="Continue"
              className="bg-slate-700 text-white w-full"
              disabled={!fileName} 
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <UploadInputField 
              type="file" 
              label="Select a File" 
              onChange={handleFileUpload} 
              id="file-upload" 
              required 
            />
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
                className="bg-slate-700 text-white"
                disabled={!file} // Disable if no file selected
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
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
                className="bg-slate-700 text-white"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-4">
            {uploadStatus === 'success' ? (
              <div className="text-green-600">
                <FaCheckCircle className="text-5xl mx-auto mb-4" />
                <p className="text-lg font-semibold">Upload Successful!</p>
                {uploadedFile && (
                  <p className="mt-4 text-gray-700">
                    Uploaded File: <strong>{uploadedFile}</strong>
                  </p>
                )}
                <UploadButton
                  onClick={handleGoToProject}
                  label="View Project"
                  className="bg-slate-700 text-white"
                />
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
