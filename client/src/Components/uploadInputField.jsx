import React from 'react';

const uploadInputField = ({ label, type = 'text', value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">
      <label className="block text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default uploadInputField;
