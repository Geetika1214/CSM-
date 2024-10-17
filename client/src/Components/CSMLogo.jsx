import React from 'react';

const CSMLogo = () => {
  return (
    <div className="flex items-center justify-center py-6 mb-6">
      <h1
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 shadow-lg transition-transform transform hover:scale-105"
        role="heading" // Accessibility improvement
        aria-label="CSM Logo" // Optional: adds context for screen readers
      >
        CSM
      </h1>
    </div>
  );
};

export default CSMLogo;
