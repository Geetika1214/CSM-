import React from 'react';
import PropTypes from 'prop-types';

const UploadButton = ({ 
  label, 
  onClick, 
  icon, 
  className = '', 
  disabled = false, 
  type = 'button', 
  loading = false 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded transition-colors duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-busy={loading}
    >
      {loading ? (
        <span className="mr-2 loader">Loading...</span> 
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {label}
    </button>
  );
};

UploadButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  loading: PropTypes.bool,
};

export default UploadButton;
