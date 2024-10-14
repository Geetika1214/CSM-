import React from 'react';
import InputField from './InputField';
import Button from './Button';

const GenerateNewPasswordForm = () => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
                
                {/*  Enter Email */}
                <InputField
                type="email"
                placeholder="Enter Email" />

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

  );
};

export default GenerateNewPasswordForm;
