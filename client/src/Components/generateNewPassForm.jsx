import React, { useState } from 'react';
import Container from '../Components/Container'; // Import the Container component
import InputField from '../Components/InputField'; // Import the InputField component
import Button from '../Components/Button'; // Import the Button component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const GenerateNewPassword = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigation

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Basic validation
        if (!verificationCode || !newPassword || !confirmPassword) {
            setErrorMessage('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        // Implement your password change logic here
        // For example, make an API call to update the password
        // Simulate a successful password change
        setSuccessMessage('Password changed successfully');
        setErrorMessage('');

        // Optionally, navigate to another page after success
        // navigate('/signin');
    };

    return (
        <Container width="380px">
            <h2 className="text-2xl font-bold text-center mb-6">Generate New Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Verification Code Input */}
                <InputField 
                    type="text" 
                    id="verification-code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter Verification Code" 
                    required
                />

                {/* New Password Input */}
                <InputField 
                    type="password" 
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password" 
                    required
                />

                {/* Confirm Password Input */}
                <InputField 
                    type="password" 
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password" 
                    required
                />

                {/* Error Message */}
                {errorMessage && (
                    <p className="text-red-500 text-center mt-2 font-semibold">
                        {errorMessage}
                    </p>
                )}

                {/* Submit Button */}
                <Button 
                    text="Submit" 
                    type="submit" 
                    className="bg-slate-700 text-white w-full"
                    disabled={!verificationCode || !newPassword || !confirmPassword}
                />
            </form>

            {/* Success Message */}
            {successMessage && (
                <p className="text-green-500 text-center mt-4 font-semibold">
                    {successMessage}
                </p>
            )}
        </Container>
    );
};

export default GenerateNewPassword;
