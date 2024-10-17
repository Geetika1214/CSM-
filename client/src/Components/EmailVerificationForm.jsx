import React, { useState, useContext } from 'react';
import InputField from '../Components/InputField';
import Button from '../Components/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [ success , setSuccess] = useState(false);

  const [verified, setVerified] = useState(false); // State to track verification status
  const navigate = useNavigate();
  const { emailverify } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode) {
      setMessage('Please enter the verification code');
      return;
    }

    const email = localStorage.getItem('email'); // Retrieve email from localStorage
    console.log(email);
    console.log(verificationCode);
    try {
      // Call emailverify function from AuthContext
      await emailverify(email, verificationCode);
      setVerified(true);
      setMessage('Your email is successfully verified! You can now proceed to the homepage.');
      setSuccess(true);
    } catch (error) {
      setMessage(error.message); // Show the error message from the backend
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-slate-700">Email Verification</h2>
        <p className="text-center mb-4">
          We’ve sent you a verification code to your email.
        </p>

        {!verified ? (
          <>
            <div className="mb-4">
              <InputField
                type="text"
                name="email"
                id='email'
                placeholder="Enter Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              />
            </div>
            <Button text="Submit"
             className="bg-slate-700 text-white w-full"
            type="submit" />
          </>
        ) : (
          <Button 
            className='bg-slate-700 text-white w-full'
            text="Home" onClick={() => navigate('/')} type="button" />

          
        )} 
 
           

        {message && (
          <p className={`text-center ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
        )}
      </form>
    </div>
  );
};

export default EmailVerification;
