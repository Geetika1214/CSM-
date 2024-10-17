import React from 'react';
import PropTypes from 'prop-types';

const ProjectContainer = ({ children, height = 'auto', width = '100%' }) => {
  return (
    <div className="flex justify-center items-center">
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
};

export default ProjectContainer;
