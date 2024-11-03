// DescriptionInput.jsx
import React from "react";
import PropTypes from "prop-types";

const DescriptionInput = ({ description, setDescription }) => {
  const handleChange = (event) => {
    setDescription(event.target.value);
    console.log("New description:", event.target.value); 
  };

  return (
    <div className="mb-4">
      <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
        Description:
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value) || handleChange} // Call setDescription on change
        className="w-full p-2 border border-gray-300 rounded-md"
        rows="4"
      />
    </div>
  );
};

DescriptionInput.propTypes = {
  description: PropTypes.string, 
  setDescription: PropTypes.func, 
};

export default DescriptionInput;
