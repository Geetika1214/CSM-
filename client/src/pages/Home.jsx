// src/components/Home.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toolbar from '../Components/Toolbar';
import ProjectContainer from '../Components/ProjectContainer';
import axios from '../utils/axiosConfig';
import { FaPlus, FaUpload } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectFiles, setProjectFiles] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleNewProject = () => {
    setIsCreatingProject(true);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('title', projectName);
    formData.append('description', projectDescription);

    if (projectFiles) {
      for (let i = 0; i < projectFiles.length; i++) {
        formData.append('files', projectFiles[i]);
      }
    }


    try {
      const response = await axios.post('/api/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProjects([...projects, response.data.project]);
      resetForm();
      setIsCreatingProject(false);
      setMessage(response.data.message);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectFiles(null);
  };

  const handleFileUpload = (event) => {
    setProjectFiles(event.target.files);
  };

  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  // Fetch projects when component mounts

  const fetchProjects = async () => {
    try {
        const token = localStorage.getItem('access_token'); // Replace with your actual token retrieval method

        const response = await fetch('http://127.0.0.1:5000/api/projects', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        // Process your data here...
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};


  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <div id="webcrumbs" className="flex h-screen" >
        <Toolbar />

        <div className="flex-1 bg-white p-10">
          <h1 className="text-3xl font-semibold text-center mb-8">Home</h1>

          {isCreatingProject ? (
            <div className="flex flex-col items-center justify-center w-full ">
              <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

              <form onSubmit={handleCreateProject} className="bg-slate-100 p-8 rounded-lg shadow-md w-1/2">
                <div className="mb-4">
                  <label className="block mb-2">Project Name:</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Description:</label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Upload Files:</label>
                  <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={handleClick}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    <FaUpload className="mr-2" />
                    Upload Files
                  </button>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="submit"
                    className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingProject(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {error && <p style={{ color: 'red' }}>{error}</p>}
              {message && <p style={{ color: 'green' }}>{message}</p>}
            </div>
          ) : (
            <>
              {projects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {projects.map((project) => (
                      <ProjectContainer key={project.id} height="300px" width="100%">
                        <h1 className="text-xl font-semibold text-center mb-4">{project.title}</h1>
                        <div className="border border-gray-300 bg-white rounded-lg h-[90%] flex items-center justify-center">
                          <p>{project.description}</p>
                        </div>
                      </ProjectContainer>
                    ))}
                  </div>

                  <div className="mt-10">
                    <label htmlFor="project-select" className="block text-lg font-semibold mb-2 text-center">
                      Select an existing project:
                    </label>
                    <select
                      id="project-select"
                      value={selectedProject}
                      onChange={handleProjectChange}
                      className="text-center p-2 border bg-slate-100 mx-auto border-gray-300 rounded-md w-[40%]"
                    >
                      <option value="">Select an existing project:</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.title}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-slate-100 p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-4">Haven't created any projects yet.</h2>
                    <button
                      onClick={handleNewProject}
                      className="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-2 px-4 rounded-md"
                    >
                      <FaPlus className="mr-2" />
                      Start New Project
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
