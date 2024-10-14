import React from 'react';

const ProjectContainer = ({ children, height, width }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="bg-slate-100 p-8 rounded-xl shadow-lg"
        style={{ width, height }} // Dynamic height and width
      >
        {children}
      </div>
    </div>
  );
};

export default ProjectContainer;