import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Toolbar from "../Components/Toolbar";
import DescriptionInput from "../Components/DescriptionInput";
import FileButtons from "../Components/FIleButtons";
import Workspace from "../Components/Workspace";

export const ProjectDetail = () => {
  const { id } = useParams(); 
  const [description, setDescription] = useState(""); // Manages description state

  const fetchProjectDetails = async () => {
    console.log("Fetching details for project ID:", id);
    try {
      const response = await axios.get(`/api/projects/${id}`); // Fetch project details
      setDescription(response.data.description); // Set the description
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails(); // Fetch the project details on component load
  }, [id]);

  return (
    <div id="webcrumbs" className="flex min-h-screen bg-gray-100">
      {/* Toolbar component */}
      <Toolbar className="h-full bg-gray-200" />

      {/* Main content area */}
      <div className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="font-title text-3xl font-semibold text-gray-800 mb-4">
            Project Name {id}
          </h1>
          {/* DescriptionInput: Passing description and setDescription */}
          <DescriptionInput description={description} setDescription={setDescription} />
          <Workspace />
          <FileButtons />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
