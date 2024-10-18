import React from 'react';
import Toolbar from '../Components/Toolbar'; // Import your Toolbar component
import Image from '../Components/Image'; // Import your Image component

const Profile = () => {
  // Retrieve user data from local storage (or use your state management solution)
  const userName = localStorage.getItem('username') || 'User'; // Default to 'User' if not found
  const userEmail = localStorage.getItem('email') || 'example@gmail.com'; // Default email

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar/Toolbar */}
        <Toolbar className="h-full bg-gray-100" /> 

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
          {/* Avatar Image */}
          <Image
            src="https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg" 
            alt="User Avatar"
            className="rounded-full mx-auto mb-6 w-32 h-32 md:w-48 md:h-48" 
          />

          {/* Full Name */}
          <h2 className="text-2xl md:text-3xl text-blue-800 font-semibold mb-2">{userName}</h2>

          {/* Email */}
          <p className="text-gray-600 font-bold text-lg md:text-xl">{userEmail}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
