// src/Context/AuthProvider.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Allows programmatic navigation

  // Check if user is already authenticated when the component loads
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  // Login function that authenticates the user
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/signin', { email, password });
      const { access_token, refresh_token } = response.data;
      
      // Store the tokens and user information in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify({ email }));

      // Update the state to indicate the user is logged in
      setIsAuthenticated(true);
      setUser({ email });

      // Navigate to the home page after successful login
      navigate('/');
      console.log('Login successful');
    } catch (error) {
      console.error('Login error', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Invalid email or password');
    }
  };

  // Register function that creates a new user and prompts for email verification
  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/signup', {
        username,
        email,
        password,
        confirmPassword: password,
      });

      console.log('Signup response:', response);

      if (response.status === 201) {
        alert('Signup successful! Please verify your email to continue.');
        localStorage.setItem('email', email);
        navigate('/emailverification'); // Redirect to email verification page
      }
      console.log('User registration complete');
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  // Logout function to remove user information and token from localStorage
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/signin'); // Redirect to sign-in page after logout
  };

  // email verify
  const emailverify = async (email, verificationCode) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/emailverification', {
        email,
        verification_code: verificationCode,
      });
      console.log(response.data.message);
      if (response.status === 200) {
        // await login(email, password);
        
        return response.data.message;
        
      }
    } catch (error) {
      throw new Error(error.response.data.error || 'Verification failed');
    }
  };
  return (
   
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout , emailverify }}>
      {children}
    </AuthContext.Provider>
  );
};
