import React, { useState } from "react";
import { FaEdit } from "react-icons/fa"; // Import FaEdit icon from react-icons
import Toolbar from "../Components/Toolbar";

export const Account = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="webcrumbs" className="flex flex-col sm:flex-row h-screen">
      {/* Toolbar */}
      <Toolbar />

      <main className="flex-1 p-6 md:p-10 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          {/* Account Header */}
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 text-center mb-6">
            Account Settings
          </h1>

          <p className="text-center text-green-600 font-medium mb-8">
            Update your profile details
          </p>

          {/* Profile Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {/* Name Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <div className="flex items-center border border-gray-300 rounded-md bg-white">
                <input
                  type="text"
                  className="w-full py-2 px-4 text-base rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your full name"
                />
                <span className="p-2 bg-gray-100 rounded-r-md">
                  <FaEdit className="text-gray-600" /> {/* Using FaEdit icon */}
                </span>
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center border border-gray-300 rounded-md bg-white">
                <input
                  type="email"
                  className="w-full py-2 px-4 text-base rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
            />
                <span className="p-2 bg-gray-100 rounded-r-md">
                  <FaEdit className="text-gray-600" /> {/* Using FaEdit icon */}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
    
export default Account;
