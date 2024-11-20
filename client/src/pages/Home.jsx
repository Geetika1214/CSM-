import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toolbar from '../Components/Toolbar';
import ProjectContainer from '../Components/ProjectContainer';
import axios from '../utils/axiosConfig';
import { FaPlus } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleProjectChange = (event) => {
    const selectedId = event.target.value;
    if (selectedId) {
      navigate(`/project/${selectedId}`);
    }
    setSelectedProject(selectedId);
  };

  const handleNewProject = () => setIsCreatingProject(true);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const title = projectName.trim();
    const description = projectDescription.trim();

    if (!title || !description) {
      setError('Project name and description cannot be empty');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/projects', { title, description });
      setProjects((prevProjects) => [...prevProjects, response.data.project]);
      resetForm();
      setIsCreatingProject(false);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data.error || 'An unexpected error occurred');
    }
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (message) fetchProjects();
  }, [message]);

  return (
    
    <div id="webcrumbs" className="flex flex-col sm:flex-row h-screen">
        <Toolbar  />

        <div className="flex-1 bg-white p-6">

          {isCreatingProject ? (
            <div className="flex flex-col items-center w-full">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">Create New Project</h2>

              <form onSubmit={handleCreateProject} className="bg-slate-100 p-6 rounded-lg shadow-lg w-96 mt-8">
                <div className="mb-4">
                  <label className="block mb-4 font-semibold">Project Name:</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-4  font-semibold">Description:</label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="submit"
                    className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingProject(false)}
                    className="bg-gray-300 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {error && <p className="text-red-500 mt-4">{error}</p>}
              {message && <p className="text-green-500 mt-4">{message}</p>}
            </div>
          ) : (
            <>
              {projects.length > 0 ? (
                <div className="flex flex-col items-center">
                  
                  <div className=" text-center w-full max-w-md">
                  <div className="absolute top-4 right-4">
                    <select
                      id="project-select"
                      value={selectedProject}
                      onChange={handleProjectChange}
                      className="text-center text-white p-2 border bg-slate-700 mx-auto border-gray-300 rounded-md "
                    >
                      <option value="">Select an existing project:</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 mt-12 w-full max-w-6xl">
                      {projects.map((project) => (
                        <ProjectContainer 
                          key={project.id} 
                          height="275px" 
                          width="100%"
                          onClick={() => navigate(`/project/${project.id}`)} 
                          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
                        >
                          <div className="p-4">
                            <h1 className="text-lg font-bold text-center text-gray-800 mb-3">
                              {project.title}
                            </h1>
                            <div className="border-t border-gray-300 pt-3 flex flex-col items-center text-gray-600">
                              <p className="text-sm font-semibold mb-2">Description:</p>
                              <p className="text-center text-sm leading-6">{project.description}</p>
                            </div>
                          </div>
                        </ProjectContainer>
                      ))}
                    </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-slate-100 p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-4">Haven't created any projects yet.</h2>
                    <button
                      onClick={handleNewProject}
                      className="flex items-center justify-center bg-slate-600 hover:bg-blue-200 text-white font-semibold py-2 px-4 rounded-md"
                    >
                      <FaPlus className="mr-2 " />
                      Start New Project
                    </button>
                  </div>
                </div>
              )
              }
            </>
          )}
        </div>
      </div>
  );
}
