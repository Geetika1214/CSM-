import React, { useState } from 'react';
import Container from '../Components/Container';
import InputField from '../Components/InputField';
import Button from '../Components/Button';
import SecondaryButton from '../Components/SecondaryButton';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const validateEmail = (email) => {
        // Simple email regex pattern
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email) {
            setError('Email is required.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/forgot-password', {
                email,
            });

            // Assuming the server response structure
            if (response.status === 200) {
                setMessage(response.data.message || 'If this email is registered, you will receive a password reset link.');
                navigate("/generatenewpass")
            } else {
                setError('An error occurred. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                // Server responded with an error
                setError(error.response.data.error || 'Verification failed');
            } else {
                // Network or other error
                setError('Network error. Please try again later.');
            }
        }
    };

    return (
        <Container height='350px' width='400px'>
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Your Password?</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <InputField 
                    type="email" 
                    id="forgot-password-email"
                    value={email}
                    onChange={handleChange}
                    name='email'
                    placeholder="Enter your email" 
                    required
                />

                {/* Error Message */}
                {error && (
                    <p className="text-center text-red-600">
                        {error}
                    </p>
                )}

                {/* Message Display */}
                {message && (
                    <p className="text-center text-green-600">
                        {message}
                    </p>
                )}

                {/* Reset Password Button */}
                <Button 
                    text="Reset Password" 
                    type="submit" 
                    className="bg-slate-700 text-white w-full"
                    disabled={!email}
                />
                
                {/* Back to Sign In Button */}
                <SecondaryButton 
                    text="Back to Sign In" 
                    path="/signin" 
                    className="w-full"
                />
            </form>
        </Container>
    );
};

export default ForgotPassword;
