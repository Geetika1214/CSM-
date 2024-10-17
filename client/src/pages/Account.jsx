import React, { useState } from "react";
import { FaEdit } from "react-icons/fa"; // Import FaEdit icon from react-icons
import Toolbar from "../Components/Toolbar";
import UploadInputField from "../Components/UploadInputField"; // Import your UploadInputField
import UploadButton from "../Components/UploadButton"; // Import your UploadButton

export const Account = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSaveChanges = () => {
    // Logic to handle saving changes
    console.log("Saving changes:", { name, email });
  };

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
              <UploadInputField 
                label="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your full name" 
                id="name" 
              />
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <UploadInputField 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                id="email" 
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <UploadButton 
                label="Save Changes" 
                onClick={handleSaveChanges} 
                className="bg-blue-500 text-white" 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
