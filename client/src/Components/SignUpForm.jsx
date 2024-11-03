import React, { useState, useContext } from 'react';
import InputField from './InputField';
import Checkbox from './Checkbox';
import Button from './Button';
import { AuthContext } from '../context/AuthProvider'; // Import AuthContext

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext); // Access register method from AuthProvider

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setAgree(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Basic front-end validations
    if (!formData.username) {
      setMessage('Username is required');
      return;
    }

    if (!formData.email) {
      setMessage('Email is required');
      return;
    }

    if (!formData.password) {
      setMessage('Password is required');
      return;
    }

    if (!formData.confirmPassword) {
      setMessage('Please confirm your password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    if (!agree) {
      setMessage('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      setMessage('Registration successful!'); // Success message
    } catch (error) {
      setMessage(error.message || 'An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-slate-700">Sign Up</h2>

        {/* Username Input */}
        <InputField
          type="text"
          name="username" // Ensure name is provided
          id="username" // Ensure id is provided
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* Email Input */}
        <InputField
          type="email"
          name="email" // Ensure name is provided
          id="email" // Ensure id is provided
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password Input */}
        <InputField
          type="password"
          name="password" // Ensure name is provided
          id="password" // Ensure id is provided
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Confirm Password Input */}
        <InputField
          type="password"
          name="confirmPassword" // Ensure name is provided
          id="confirmPassword" // Ensure id is provided
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {/* Checkbox for Terms */}
        <div className="flex items-center">
          <Checkbox
            name="agree"
            label="Agree to Our Terms and Conditions"
            checked={agree}
            onChange={handleCheckboxChange}
          />
        </div>

        {/* Submit Button */}
        <Button 
          text={loading ? "Processing..." : "Continue"} 
          type="submit"
          className="bg-slate-700 text-white w-full"
          disabled={loading} 
        />

        {/* Message Display */}
        {message && (
          <p className={`text-center ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        {/* Already registered */}
        <p className="text-center text-gray-600">
          Already registered?{' '}
          <a href="/signin" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
