// SignUpForm.js

import React, { useState } from 'react';
import InputField from './InputField';
import Checkbox from './Checkbox';
import Button from './Button';
import axios from 'axios';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validations
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!formData.agree) {
      setMessage('You must agree to the terms and conditions');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 201) {
        setMessage('Signup successful! Please verify your email.');
        // Redirect or perform other actions as needed
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred. Please try again.');
      }
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
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />

        {/* Email Input */}
        <InputField
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />

        {/* Password Input */}
        <InputField
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />

        {/* Confirm Password Input */}
        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />

        {/* Checkbox */}
        <div className="flex items-center">
          <Checkbox
            name="agree"
            label="Agree to Our Terms and Conditions"
            checked={formData.agree}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <Button text="Continue" type="submit"  path="/"/>

        {/* Message Display */}
        {message && (
          <p className="text-center text-red-600">
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
