import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Toolbar from "../Components/Toolbar";
import DescriptionInput from "../Components/DescriptionInput";
import FileButtons from "../Components/FileButtons"; // Ensure this has the upload button
import Workspace from "../Components/Workspace";

export const ProjectDetail = () => {
  const { id } = useParams(); 
  const [description, setDescription] = useState(""); // Manages description state
  const [uploadedFile, setUploadedFile] = useState(null); // State for uploaded file name
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`); // Fetch project details
      if (response.data) {
        setDescription(response.data.description); // Set the description
        setUploadedFile(response.data.uploadedFile || null); // Handle undefined file
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Failed to fetch project details. Please try again later."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchProjectDetails(); // Fetch the project details on component load
  }, [id]);

  // Handle successful file uploads
  const handleUploadSuccess = (fileName) => {
    setUploadedFile(fileName); // Update the uploaded file state
  };

  if (loading) return <div>Loading...</div>; // Loading state
  if (error) return <div>{error}</div>; // Error state

  return (
    <div id="webcrumbs" className="flex min-h-screen bg-gray-100">
      <Toolbar className="h-full bg-gray-200" />

      <div className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="font-title text-3xl font-semibold text-gray-800 mb-4">
            Project Name: {id}
          </h1>

          <DescriptionInput description={description} setDescription={setDescription} />
          <Workspace uploadedFile={uploadedFile} />
          <FileButtons onUploadSuccess={handleUploadSuccess} uploadedFile={uploadedFile}/>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
