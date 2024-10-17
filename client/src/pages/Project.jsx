// src/pages/Project.jsx

import React, { useState } from "react";
import { FaPlus, FaFolder, FaEdit } from "react-icons/fa"; // Importing FaPlus, FaFolder, and FaEdit icons
import { Link } from "react-router-dom"; // Import Link for navigation
import Toolbar from "../Components/Toolbar";
import PropTypes from 'prop-types'; // If needed

export const Project = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project Name 1" },
    { id: 2, name: "Project Name 2" },
    { id: 3, name: "Project Name 3" },
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(projects[index].name); // Pre-fill the input with the current project name
  };

  const handleUpdate = (index) => {
    const updatedProjects = [...projects];
    updatedProjects[index].name = editedName.trim();
    setProjects(updatedProjects);
    setEditingIndex(null);
  };

  const handleAddProject = () => {
    if (newProjectName.trim() === "") return;
    const newProject = {
      id: projects.length + 1, // In a real app, IDs should come from the backend
      name: newProjectName.trim(),
    };
    setProjects([...projects, newProject]);
    setNewProjectName("");
    setNewProjectModalOpen(false);
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
                <div
                  key={project.id}
                  className="flex items-center justify-between border border-gray-200 bg-white p-4 rounded-md shadow-sm"
                >
                  {editingIndex === index ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md"
                        aria-label={`Edit name for ${project.name}`}
                      />
                      <button
                        onClick={() => handleUpdate(index)}
                        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        aria-label="Save project name"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to={`/project/${project.id}`} className="font-medium flex-grow">
                        {project.name}
                      </Link>
                      <button
                        onClick={() => handleEditClick(index)}
                        className="text-gray-600 hover:text-blue-500"
                        aria-label={`Edit ${project.name}`}
                      >
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
            <button
              onClick={() => setNewProjectModalOpen(true)}
              className="bg-slate-700 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition duration-200"
              aria-label="Add New Project"
            >
              Add New Project
              <FaPlus />
            </button>
          </div>

          {/* New Project Modal */}
          {newProjectModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
                <h2 className="text-2xl font-semibold mb-4">Add New Project</h2>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter project name"
                  aria-label="New project name"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setNewProjectModalOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    aria-label="Cancel adding project"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProject}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    aria-label="Add project"
                    disabled={newProjectName.trim() === ""}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// If you plan to define propTypes for Project, though it's not necessary here as it doesn't receive props
Project.propTypes = {};

export default Project;
