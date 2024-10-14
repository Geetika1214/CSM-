import React from 'react';
import Container from '../Components/Container';
import InputField from '../Components/InputField';
import Button from '../Components/Button';
import SecondaryButton from '../Components/SecondaryButton';

const ForgotPassword = () => {
    return (
        <Container>
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Your Password?</h2>

            <form className="space-y-4">
                {/* Email Input */}
                <InputField 
                    type="email" 
                    placeholder="Enter your email" 
                />

                {/* Reset Password Button */}
                <Button text="Reset Password" path="/generatenewpass" />
                
                {/* Back to Sign In Button */}
                <SecondaryButton text="Back to Sign In" path="/signin" />
            </form>
        </Container>
    );
};

export default ForgotPassword;
