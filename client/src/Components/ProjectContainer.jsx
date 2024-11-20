import React from 'react';
import PropTypes from 'prop-types';

const ProjectContainer = ({ children, height = 'auto', width = '100%', onClick }) => {
  return (
    <div 
      className="flex justify-center items-center cursor-pointer"
      onClick={onClick} // Set onClick handler
      role="button" // Improve accessibility by defining it as a button
      tabIndex={0} // Make it focusable for accessibility
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick && onClick(e); // Handle Enter or Space for keyboard users
      }}
    >
      <div
        className="bg-slate-100 p-8 rounded-xl shadow-lg"
        style={{ width, height }} // Dynamic height and width
        aria-live="polite" // Improve accessibility
      >
        {children}
      </div>
    </div>
  );
};

// PropTypes validation
ProjectContainer.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  onClick: PropTypes.func, // Mark onClick as a function type prop
};

export default ProjectContainer;
