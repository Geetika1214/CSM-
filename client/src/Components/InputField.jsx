const InputField = ({ label, type, name, placeholder, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm text-gray-700">{label}</label>
      <input
        type={type}
        name={name} // Add the name prop here
        placeholder={placeholder}
        value={value} // Bind the value to the parent component's state
        onChange={onChange} // Trigger the onChange event to update state
        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
    </div>
  );
};

export default InputField;
