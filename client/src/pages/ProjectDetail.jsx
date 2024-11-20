// src/Components/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Toolbar from "../Components/Toolbar";
import { FaUpload, FaDownload, FaRocket } from 'react-icons/fa'; 

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [status, setStatus] = useState(""); 
  const [FileStatusMessage , setFileStatusMessage] = useState(null);
  const token = localStorage.getItem('access_token');

  const fetchProjectDetails = async () => {
    // console.log("Fetching project details with id:", id);
    
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setDescription(response.data.description);
        setProjectName(response.data.title);
        setUploadedFile(response.data.uploadedFile || null);
        
        if (response.data.file_path && typeof response.data.file_path === 'string') {
          const fileName = response.data.file_path.split('\\').pop();
          setFileName(fileName);
          setFileStatusMessage(`The associated file is: ${fileName}`);
        } else {
          setFileStatusMessage("No file associated with this project yet. Upload one to get started!");
        }
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Failed to fetch project details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const saveDescription = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/project/${id}`, 
        {description},
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }}
      );
      alert("Description updated successfully!");
    } catch (error) {
      console.error("Failed to update description:", error);
      setError("Could not update description. Please try again.");
    }
  };

  const handleUploadClick = () => {
    setStatus("Uploading..."); // Set status to uploading
    navigate(`/fileupload/${id}`);
  };

  const handleDownloadClick = async () => {
    setStatus("Downloading...");
    try {
      const response = await fetch('http://127.0.0.1:5000/api/download-latest', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to download the file.');
        setStatus("Failed to download.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'latest_processed_file';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      setStatus("Download complete");
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('An error occurred while downloading the file.');
      setStatus("Error downloading file.");
    }
  };

  const handleProcessClick = async () => {
    setStatus("Processing...");
    try {
      const response = await fetch('http://127.0.0.1:5000/api/process-file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to process the file.');
        setStatus("Failed to process.");
        return;
      }

      const data = await response.json();
      if (data.output_file_path) {
        setStatus("Processing complete");
        setFileStatusMessage(`The output file is available to download: ${data.output_file_path}`);
      } else {
        setStatus("Processing complete - No output file path received");
      }
    } catch (error) {
      console.error('Error processing the file:', error);
      alert('An error occurred while processing the file.');
      setStatus("Error processing file.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div id="webcrumbs" className="flex min-h-screen bg-gray-100">
      <Toolbar className="h-full bg-gray-200" />

      <div className="flex-1 p-8 mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 ">
          <h1 className="font-title text-3xl font-semibold text-slate-900 mb-10">
             {projectName}
          </h1>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
            />
            {/* <button
              onClick={saveDescription}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Update Description
            </button> */}
          </div>
  

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Workspace</h2>
            <div className="h-64 border border-gray-300 rounded-md flex items-center justify-center text-gray-500">
              <p>{FileStatusMessage}</p>
            </div>
          </div>

          {/* File Upload, Process, and Download Buttons */}
          <div  className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleUploadClick}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              aria-label="Upload Files"
            >
              <FaUpload className="mr-2" />
              Upload Files
            </button>
            {fileName && (
              <button
                onClick={handleProcessClick}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                aria-label="Process Files"
              >
                <FaRocket className="mr-2" />
                Process Files
              </button>
            )}
            <button
              onClick={handleDownloadClick}
              className="flex items-center bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition"
              aria-label="Download Files"
            >
              <FaDownload className="mr-2" />
              Download Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
