import React from 'react';
import InputField from './InputField';
import Button from './Button';

const EmailVerificationForm = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-slate-700">Email Verification</h2>
        <p className="text-center mb-4">
          We’ve sent you a verification code to your email
        </p>
        <div className="mb-4">
          <InputField 
            type="text" 
            placeholder="Enter Verification Code" 
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>

        <Button text="Submit" path="/" />
      </form>
    </div>
  );
};

export default EmailVerificationForm;
