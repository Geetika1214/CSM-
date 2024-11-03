import React from 'react';
import PropTypes from 'prop-types';

const UploadInputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = 'Enter value', 
  id, 
  required = false 
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

UploadInputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default UploadInputField;
