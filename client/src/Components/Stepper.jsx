import React from 'react';
import { FaCheck } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Stepper = ({ step = 1 }) => { // Default parameter
  const getStepClass = (currentStep) => {
    return currentStep <= step
      ? 'bg-indigo-600 text-white'
      : 'bg-gray-300 text-gray-600';
  };

  return (
    <div className="flex justify-between items-center mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
      {[1, 2, 3, 4].map((currentStep) => (
        <React.Fragment key={currentStep}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass(currentStep)}`}>
            {step >= currentStep ? <FaCheck /> : currentStep}
          </div>
          {currentStep < 4 && <div className="flex-1 h-1 mx-2 bg-gray-300" />}
        </React.Fragment>
      ))}
    </div>
  );
};

// Adding prop types for better validation
Stepper.propTypes = {
  step: PropTypes.number.isRequired,
};

export default Stepper;
