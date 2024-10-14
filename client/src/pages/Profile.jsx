import React from 'react';
import Toolbar from '../Components/Toolbar'; // Import your Toolbar component
import ImageComponent from '../Components/Image'; // Import your Image component

const Profile = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar/Toolbar */}
      <div className="w-full sm:w-64"> {/* Full width on small screens */}
        <Toolbar className="h-full bg-gray-100" /> {/* Ensure the toolbar takes full height */}
      </div>

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
          {/* Avatar Image */}
          <ImageComponent 
            src="https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg" 
            alt="User Avatar"
            className="rounded-full mx-auto mb-6 w-32 h-32 md:w-48 md:h-48" // Adjust size for different screens
          />

          {/* Full Name */}
          <h2 className="text-2xl md:text-3xl text-blue-800 font-semibold mb-2">Full Name</h2>

          {/* Email */}
          <p className="text-gray-600 font-bold text-lg md:text-xl">example@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
