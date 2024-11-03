import React, { useState, useEffect } from "react";
import Toolbar from '../Components/Toolbar'; // Import your Toolbar component
import Image from '../Components/Image'; // Import your Image component
import axios from "axios";
const Profile = () => {
  // Retrieve user data from local storage (or use your state management solution)
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [userName , setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user profile on mount
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token'); // Get token
        console.log('first')
        const response = await axios.get('http://127.0.0.1:5000/api/account', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        setUserName(response.data.user.name); // Set profile data from response
        setUserEmail(response.data.user.email); // Set profile data from response
      } catch (error) {
        console.error(error);
        setError("Failed to fetch profile data."); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProfile();
  }, [userName, userEmail]);

  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar/Toolbar */}
        <Toolbar  /> 

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center p-4 sm:p-6">
      {loading ? (
          <p>Loading...</p>
        ) : (
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
          {/* Avatar Image */}
          <Image
            src="https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg" 
            alt="User Avatar"
            className="rounded-full mx-auto mb-6 w-32 h-32 md:w-48 md:h-48" 
          />

          {/* Full Name */}
          <h2 className="text-2xl md:text-3xl text-blue-800 font-semibold mb-2">{ userName  }</h2>

          {/* Email */}
          <p className="text-gray-600 font-bold text-lg md:text-xl">{userEmail }</p>
          {error && <p className="text-red-500">{error}</p>}

        </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
