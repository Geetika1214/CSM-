// src/Components/Checkbox.jsx

import React from 'react';

const Checkbox = ({ name, label, checked, onChange }) => {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-5 w-5 text-blue-600"
        aria-labelledby={`${name}-label`} // Accessibility improvement
      />
      <span id={`${name}-label`} className="ml-2 text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;
