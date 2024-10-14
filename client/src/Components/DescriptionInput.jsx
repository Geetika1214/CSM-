import React from "react";
import Field from "./Field"; // Import Field component

const DescriptionInput = ({ description, setDescription }) => {
  return (
    <Field
      type="textarea"
      label="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Enter project description here..."
    />
  );
};

export default DescriptionInput;
