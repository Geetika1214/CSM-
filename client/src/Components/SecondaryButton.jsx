import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SecondaryButton = ({ text, path }) => {
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
        focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50`}
    >
      {text}
      <FaArrowRight className="ml-2" />
    </button>
  );
};

export default SecondaryButton;
