import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Navigate programmatically

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/signin', { email, password });
      const { access_token } = response.data;
  
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify({ email }));  // Store email instead of username
  
      setIsAuthenticated(true);
      setUser({ email });  // Set user as email
      navigate('/');  // Redirect to home page after login
      console.log('Login successful');
    } catch (error) {
      console.error("Login error", error);
      alert('Invalid email or password');
    }
  };
  

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/signup', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        // Automatically log in after successful signup
        await login(username, password);
      }
    } catch (error) {
      throw new Error(error.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/signin'); // Redirect to sign-in page after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
