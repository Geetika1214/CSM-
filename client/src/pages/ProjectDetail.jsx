import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Toolbar from "../Components/Toolbar"; // Import the Toolbar component
import DescriptionInput from "../Components/DescriptionInput";
import FileButtons from "../Components/FIleButtons";
import Workspace from "../Components/Workspace";
export const ProjectDetail = () => {
  const { id } = useParams(); // Get project ID from URL
  const [description, setDescription] = useState(""); // State to manage project description

  return (
    <div id="webcrumbs" className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-200 p-6 shadow-lg">
        <Toolbar className="h-full bg-gray-200" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Project Name Heading */}
          <h1 className="font-title text-3xl font-semibold text-gray-800 mb-4">
            Project Name {id}
          </h1>

          {/* Project Description Input */}
          <DescriptionInput description={description} setDescription={setDescription} />


          {/* Workspace Container */}
          <Workspace />


          {/* Upload and Download Buttons */}
          <FileButtons />

        </div>
      </div>
    </div>
  );
};
export default ProjectDetail;
