// src/Components/Toolbar.jsx

import React, { useContext, useState } from "react";
import PropTypes from 'prop-types'; // Import PropTypes
import { FaSignOutAlt, FaBars, FaHome, FaUserAlt, FaCogs, FaFolder } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from '../context/AuthProvider';
import CSMLogo from "./CSMLogo";

const Toolbar = ({ className = '' }) => {
  const location = useLocation();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Profile", icon: <FaUserAlt />, path: "/profile" },
    { name: "Account", icon: <FaCogs />, path: "/account" },
    { name: "Project", icon: <FaFolder />, path: "/project" },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') ? toggleSidebar() : null}
        aria-expanded={isOpen}
        className="text-gray-700 absolute top-4 left-4 z-50 focus:outline-none"
        style={{ zIndex: 1000 }}
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 h-screen bg-gray-100 text-gray-800 transition-all duration-300 transform ${isOpen ? "translate-x-0 opacity-100 w-64" : "-translate-x-full opacity-0"}`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        role="navigation"
      >
        <CSMLogo />

        {/* Navigation Items */}
        <ul className="space-y-4 px-4">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center space-x-4 px-4 py-2 cursor-pointer rounded-lg transition-colors duration-300 ${
                location.pathname === item.path ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
            >
              <Link to={item.path} className="flex items-center space-x-4 w-full">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Conditional Sign Out/Sign In button */}
        <div className="absolute bottom-8 w-full px-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center w-auto space-x-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link to="/signin">
              <button className="flex items-center w-auto space-x-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white">
                <span>Sign In</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
};

export default Toolbar;
