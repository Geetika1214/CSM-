import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SecondaryButton = ({ text, path, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) navigate(path);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-lg 
        transition-transform duration-300 ease-in-out transform hover:shadow-md 
        hover:scale-105 active:scale-95 focus:outline-none 
        focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ${className}`} // Allow additional classes
      aria-label={text} // Improve accessibility
    >
      {text}
      <FaArrowRight className="ml-2" />
    </button>
  );
};

// Adding prop types for better validation
SecondaryButton.propTypes = {
  text: PropTypes.string.isRequired,
  path: PropTypes.string,
  className: PropTypes.string,
};

// Default props are handled via default parameters

export default SecondaryButton;
