import React, { useState } from 'react';
import Container from '../Components/Container'; // Import the Container component
import InputField from '../Components/InputField'; // Import the InputField component
import Button from '../Components/Button'; // Import the Button component

const GenerateNewPassword = () => {
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle password change goes here

        // Display success message after submission
        setSuccessMessage('Password changed successfully');
    };

    return (
        <Container width="380px">
            <h2 className="text-2xl font-bold text-center mb-6">Generate New Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Verification Code Input */}
                <InputField 
                    type="text" 
                    placeholder="Enter Verification Code" 
                />

                {/* New Password Input */}
                <InputField 
                    type="password" 
                    placeholder="Enter New Password" 
                />

                {/* Confirm Password Input */}
                <InputField 
                    type="password" 
                    placeholder="Confirm Password" 
                />

                {/* Submit Button */}
                <Button text="Submit" />
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
