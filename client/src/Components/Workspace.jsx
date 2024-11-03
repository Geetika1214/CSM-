// src/Components/Workspace.jsx

import React from 'react';
import PropTypes from 'prop-types';

const Workspace = () => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Workspace</h2>
      {/* Implement workspace functionalities here */}
      <div className="h-64 border border-gray-300 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Workspace Area</p>
      </div>
    </div>
  );
};

Workspace.propTypes = {};

export default Workspace;
