import React, { useState, useEffect } from "react";
import Toolbar from "../Components/Toolbar";
import axios from "axios";

export const Account = () => {
  const [name, setName] = useState("");
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("No authorization token found. Please log in.");
        return;
      }
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/account', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        
        setProfileData(response.data.user);
        setName(response.data.user.username);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile data. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  // Handle saving changes
  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No authorization token found. Please log in.");
        return;
      }
      const response = await axios.put(
        "http://127.0.0.1:5000/api/account",
        JSON.stringify({ name }), 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        }
        
      );
      console.log(response);
      setProfileData((prevData) => ({ ...prevData, name }));
      // localStorage.setItem('name', name);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("Unauthorized access. Please log in again.");
        localStorage.removeItem("access_token");
      } else {
        setError("Failed to save changes. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="webcrumbs" className="flex flex-col sm:flex-row h-screen">
      <Toolbar />
      <main className="flex-1 p-6 md:p-10 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl mt-10 font-semibold text-slate-700 text-center mb-6">
            Account Settings
          </h1>

          {error && <p className="text-center text-red-600 font-medium mb-4">{error}</p>}
          {success && <p className="text-center text-green-600 font-medium mb-4">{success}</p>}

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mt-16">
            <div className="mb-6">
              <input
                type="text"
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                id="name"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                className={`px-4 py-2 bg-slate-700 text-white font-medium rounded hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
