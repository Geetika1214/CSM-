import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider'; // Import AuthContext
import InputField from './InputField';
import Checkbox from './Checkbox';
import Button from './Button';

const SignInForm = () => {
  const { login } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage('Both fields are required');
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setLoading(true); // Set loading state to true
    setMessage(''); // Clear previous messages

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setMessage('Invalid email or password');
    } finally {
      setLoading(false); // Reset loading state after request
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-slate-700">Sign In</h2>

        {/* Email Input */}
        <InputField
          type="email"
          name="email"
          id='email'
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Password Input */}
        <InputField
          type="password"
          name="password"
          id = "password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Checkbox label="Remember Me" />
          </div>
          <a href="/forgotpassword" className="text-red-500 hover:underline text-sm">
            Forgot Password?
          </a>
        </div>

        {message && (
          <p className="text-center text-red-600">
            {message}
          </p>
        )}

        <Button 
        text={loading ? "Loading..." : "Login"}
         type="submit"
         className="bg-slate-700 text-white w-full"
        disabled={loading} /> {/* Disable button when loading */}

        <p className="text-center text-gray-600">
          New User?{' '}
          <a href="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
