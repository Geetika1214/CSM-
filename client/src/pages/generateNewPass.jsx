import React, { useState } from 'react';
import Container from '../Components/Container'; // Import the Container component
import InputField from '../Components/InputField'; // Import the InputField component
import Button from '../Components/Button'; // Import the Button component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for API calls

const GenerateNewPassword = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate(); // Initialize navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(''); // Clear any previous success message
        setErrorMessage('');   // Clear any previous error message
        setLoading(true); // Set loading to true

        // Basic validation
        if (!verificationCode || !newPassword || !confirmPassword) {
            setErrorMessage('All fields are required.');
            setLoading(false); // Reset loading state
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setLoading(false); // Reset loading state
            return;
        }

        const email = localStorage.getItem("email");

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/reset-password', {
                email,
                verification_code: verificationCode,
                new_password: newPassword,
                confirm_password: confirmPassword
            });

            // Assuming the server response structure
            if (response.status === 200) {
                setSuccessMessage(response.data.message || 'Password changed successfully');
                localStorage.removeItem("email"); // Clear the email from local storage
                navigate("/"); // Navigate to the home page
            } else {
                setErrorMessage('An error occurred. Please try again.'); // Handle other response statuses
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'Network error. Please try again later.'); // Provide a user-friendly error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };
    

    return (
        <Container width="380px">
            <h2 className="text-2xl font-bold text-center mb-6">Generate New Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Verification Code Input */}
                <InputField 
                    type="text" 
                    id="verification-code"
                    name='verification-code'
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter Verification Code" 
                    required
                />

                {/* New Password Input */}
                <InputField 
                    type="password" 
                    id="new-password"
                    name='new-password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password" 
                    required
                />

                {/* Confirm Password Input */}
                <InputField 
                    type="password" 
                    id="confirm-password"
                    name='confirm-password'
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
                    text={loading ? "Submitting..." : "Submit"} 
                    type="submit" 
                    className="bg-slate-700 text-white w-full"
                    disabled={loading || !verificationCode || !newPassword || !confirmPassword} // Disable while loading
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
