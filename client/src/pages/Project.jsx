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
  const [newProjectDescription, setNewProjectDescription] = useState(""); 
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('access_token'); // Get the token from local storage
      if (!token) return; 
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
            'Content-Type': 'application/json'
          }
        });

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setProjects(response.data); // Set projects with response data
        } else {
          console.error("API returned data that is not an array");
          setProjects([]); // Fallback to an empty array if response is not an array
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]); // Fallback in case of an error
      }
    };


    fetchProjects();
  }, []);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(projects[index].title); 
  };

  const handleUpdate = async (index) => {
    const updatedProject = { ...projects[index], title: editedName.trim() };

    const token = localStorage.getItem('access_token'); 
    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/projects/${projects[index].id}`, updatedProject, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        const updatedProjects = [...projects];
        updatedProjects[index] = updatedProject; 
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
    // Trim inputs
    const title = newProjectName.trim();
    const description = newProjectDescription.trim();
  
    // Check for empty inputs
    if (title === "" || description === "") {
      console.error("Project name and description cannot be empty");
      return;
    }
  
    const newProject = {
      title: newProjectName.trim(), // Project title
      description: newProjectDescription.trim() || "Default description", // Project description
      // files: [], // Default or prompt for files
    };    
  
    const token = localStorage.getItem('access_token');
  
    try {
      console.log("Sending request to add project:", newProject); // Log the request payload
  
      const response = await axios.post('http://127.0.0.1:5000/api/projects', newProject, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the header
        }
      });
  
      if (response.status === 201) {
        console.log('response is' , response.data);
        setProjects((prevProjects) => [...prevProjects, response.data.project]); // Optimistic UI update
        setNewProjectName(""); // Clear the input after success
        setNewProjectDescription(""); // Clear the input after success
        setNewProjectModalOpen(false); // Close the modal
      } else {
        console.error("Error adding project:", response.data);
      }
    } catch (error) {
      console.error("Error adding project:", error.response?.data || error.message); // Log more specific error message
    }
  };
  

  const handleDeleteProject = async (id) => {
    const token = localStorage.getItem('access_token'); // Retrieve token from local storage
  
    try {
      // Make the DELETE request to the API
      const response = await axios.delete(`http://127.0.0.1:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
      });
  
      if (response.status === 200) {
        // Update state to remove the deleted project
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
        console.log("Project deleted successfully");
      } else {
        console.error("Error deleting project: Project not found");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  

  return (
    <div id="webcrumbs" className="flex min-h-screen bg-gray-100">
      <Toolbar/>
      <div className="flex-1 p-8 mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="font-title text-3xl font-semibold text-gray-800 mb-6">
            <FaFolder className="inline mr-2 text-slate-600" /> Projects
          </h1>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">My Projects</h2>
            <div className="flex flex-col gap-4">
              {projects.map((project, index) => (
                <div key={project.id || index} className="flex items-center justify-between border border-gray-200 bg-white p-4 rounded-md shadow-sm">
                  {editingIndex === index ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md"
                        aria-label={`Edit name for ${project.title}`}
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
                        {project.title}
                      </Link>
                      <button
                        onClick={() => handleEditClick(index)}
                        className="text-gray-600 hover:text-blue-500"
                        aria-label={`Edit ${project.title}`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-500"
                        aria-label={`Delete ${project.title}`}
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
                <input
                  type="text"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Enter project Description"
                  aria-label="New project Description"
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
