import React from 'react';
import { FaCheck } from 'react-icons/fa';

const Stepper = ({ step }) => {
  const getStepClass = (currentStep) => {
    return currentStep <= step
      ? 'bg-indigo-600 text-white'
      : 'bg-gray-300 text-gray-600';
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(1)}`}>
        {step > 1 ? <FaCheck /> : '1'}
      </div>
      <div className="flex-1 h-1 mx-2 bg-gray-300" />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(2)}`}>
        {step > 2 ? <FaCheck /> : '2'}
      </div>
      <div className="flex-1 h-1 mx-2 bg-gray-300" />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(3)}`}>
        {step > 3 ? <FaCheck /> : '3'}
      </div>
      <div className="flex-1 h-1 mx-2 bg-gray-300" />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(4)}`}>
        {step === 4 ? <FaCheck /> : '4'}
      </div>
    </div>
  );
};

export default Stepper;
