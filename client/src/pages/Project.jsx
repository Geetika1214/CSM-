import React, { useState } from "react";
import { FaPlus, FaFolder, FaEdit } from "react-icons/fa"; // Importing FaPlus, FaFolder, and FaEdit icons
import { Link } from "react-router-dom"; // Import Link for navigation
import Toolbar from "../Components/Toolbar";

export const Project = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project Name 1" },
    { id: 2, name: "Project Name 2" },
    { id: 3, name: "Project Name 3" },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(projects[index].name); // Pre-fill the input with the current project name
  };

  const handleUpdate = (index) => {
    const updatedProjects = [...projects];
    updatedProjects[index].name = editedName;
    setProjects(updatedProjects);
    setEditingIndex(null);
  };

  return (
    <div id="webcrumbs" className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
        <Toolbar className="h-full bg-gray-200" />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="font-title text-3xl font-semibold text-gray-800 mb-6">
            <FaFolder className="inline mr-2 text-slate-600" /> Projects
          </h1>

          {/* Project List */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">My Projects</h2>
            <div className="flex flex-col gap-4">
              {projects.map((project, index) => (
                <div key={project.id} className="flex items-center justify-between border border-gray-200 bg-white p-4 rounded-md shadow-sm">
                  {editingIndex === index ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                      <button
                        onClick={() => handleUpdate(index)}
                        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to={`/project/${project.id}`} className="font-medium flex-grow">
                        {project.name}
                      </Link>
                      <button onClick={() => handleEditClick(index)} className="text-gray-600 hover:text-blue-500">
                        <FaEdit />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Project Button */}
          <div className="mt-8 flex justify-center">
            <button className="bg-slate-700 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition duration-200">
              Add New Project
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
