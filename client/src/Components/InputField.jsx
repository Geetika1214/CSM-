import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = 'Enter value', 
  id, 
  name, // Add name prop
  required = false 
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name} // Use the name prop
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

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired, 
  name: PropTypes.string.isRequired, 
  required: PropTypes.bool,
};

export default InputField;
