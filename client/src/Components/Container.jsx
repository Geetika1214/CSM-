import React from 'react';

const Container = ({ children, height = 'auto', width = '100%' }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="bg-white p-8 rounded-2xl shadow-lg"
        style={{ width, height }} // Keeping inline styles for flexibility
        role="region" // Accessibility improvement
        aria-label="Content Container" // Optional: adds context for screen readers
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
