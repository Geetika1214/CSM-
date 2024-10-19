import React, { useState, useEffect } from "react";
import { FaPlus, FaFolder, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Toolbar from "../Components/Toolbar";
import axios from "axios";

export const Project = () => {
  const [projects, setProjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token'); // Get the token from local storage

      try {
        const response = await axios.get('http://127.0.0.1:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the header
          }
        });
        setProjects(response.data); // Set projects with response data
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(projects[index].name);
  };

  const handleUpdate = async (index) => {
    const updatedProject = { ...projects[index], name: editedName.trim() };

    const token = localStorage.getItem('token'); // Get the token from local storage

    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/projects/${updatedProject.id}`, updatedProject, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the header
        }
      });
      if (response.status === 200) {
        const updatedProjects = [...projects];
        updatedProjects[index] = updatedProject; // Update in state
        setProjects(updatedProjects);
        setEditingIndex(null);
      } else {
        console.error("Error updating project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleAddProject = async () => {
    if (newProjectName.trim() === "") return;

    const newProject = {
      title: newProjectName.trim(), // Adjust based on your API requirements
      description: "", // Default or prompt for description
      files: [], // Default or prompt for files
    };

    const token = localStorage.getItem('token'); // Get the token from local storage

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/projects', newProject, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the header
        }
      });
      if (response.status === 201) {
        setProjects([...projects, response.data]); // Append new project
        setNewProjectName("");
        setNewProjectModalOpen(false);
      } else {
        console.error("Error adding project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDeleteProject = async (id) => {
    const token = localStorage.getItem('token'); // Get the token from local storage

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the header
        }
      });
      if (response.ok) {
        setProjects(projects.filter(project => project.id !== id)); // Remove from state
      } else {
        console.error("Error deleting project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div id="webcrumbs" className="flex min-h-screen bg-gray-100">
      <Toolbar className="h-full bg-gray-200" />
      <div className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="font-title text-3xl font-semibold text-gray-800 mb-6">
            <FaFolder className="inline mr-2 text-slate-600" /> Projects
          </h1>
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
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-500"
                        aria-label={`Delete ${project.name}`}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
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

export default Project;
