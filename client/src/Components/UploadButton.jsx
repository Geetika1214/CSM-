import React from 'react';

const UploadButton = ({ label, onClick, icon, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default UploadButton;
