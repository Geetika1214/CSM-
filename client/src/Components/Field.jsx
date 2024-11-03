import React from "react";

const Field = ({ type, label, placeholder, value, onChange, icon, onClick }) => {
  return (
    <div className='mb-6'>
      {label && <label className='block text-gray-700 mb-2'>{label}</label>}
      {type === "input" && (
        <input
          type={type} // Allow for dynamic input types
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          aria-label={label} // Accessibility improvement
        />
      )}

      {type === "textarea" && (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={4}
          aria-label={label} // Accessibility improvement
        />
      )}

      {type === "button" && (
        <button
          onClick={onClick}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200'
        >
          {icon && <span className='material-icons'>{icon}</span>}
          {label}
        </button>
      )}
    </div>
  );
};

export default Field;
