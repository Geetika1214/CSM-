import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import Toolbar from "../Components/Toolbar";
import UploadInputField from "../Components/UploadInputField";
import UploadButton from "../Components/UploadButton";
import axios from "axios";

export const Account = () => {
  const [name, setName] = useState("");
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  useEffect(() => {
    // Fetch current user data on component mount
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authorization token found. Please log in.");
        return;
      }
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/account", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data.user);
        setName(response.data.user.username); // Set initial name value
      } catch (error) {
        console.error(error);
        setError("Failed to fetch profile data. Please try again."); // Set error message
      }
    };

    fetchProfile();
  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(""); // Clear previous error message
    setSuccess(""); // Clear previous success message

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authorization token found. Please log in.");
        return;
      }
      const response = await axios.put(
        "http://127.0.0.1:5000/api/account",
        JSON.stringify({ name }), // Ensure proper JSON format
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        }
      );
      console.log(response.data);
      setProfileData((prevData) => ({ ...prevData, name }));
      localStorage.setItem('name', name); // Update local storage
      setSuccess("Profile updated successfully!"); // Set success message
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        setError("Unauthorized access. Please log in again.");
      localStorage.removeItem("token"); // Clear the token
    } else {
      setError("Failed to save changes. Please try again."); // General error message
    }}
     finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="webcrumbs" className="flex flex-col sm:flex-row h-screen">
      <Toolbar />

      <main className="flex-1 p-6 md:p-10 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 text-center mb-6">
            Account Settings
          </h1>

          <p className="text-center text-green-600 font-medium mb-8">
            Update your profile details
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="mb-6">
              <UploadInputField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                id="name"
              />
            </div>

            <div className="flex justify-end">
            <UploadButton
                label={isLoading ? "Saving..." : "Save Changes"} // Change button text based on loading state
                onClick={handleSaveChanges}
                className={`bg-blue-500 text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading} // Disable button while loading
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
