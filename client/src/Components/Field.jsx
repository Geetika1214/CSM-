import React from "react";

const Field = ({ type, label, placeholder, value, onChange, icon, onClick }) => {
  if (type === "input") {
    return (
      <div className='mb-6'>
        {label && <label className='block text-gray-700 mb-2'>{label}</label>}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='border border-gray-300 rounded-md w-full p-2'
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className='mb-6'>
        {label && <label className='block text-gray-700 mb-2'>{label}</label>}
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='border border-gray-300 rounded-md w-full p-2'
          rows={4}
        />
      </div>
    );
  }

  if (type === "button") {
    return (
      <button
        onClick={onClick}
        className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200'
      >
        {icon && <span className='material-icons'>{icon}</span>}
        {label}
      </button>
    );
  }

  return null; // In case of unsupported type
};

export default Field;
