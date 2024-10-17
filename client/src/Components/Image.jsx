import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ src, alt = 'Image', className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.onerror = null; // Prevents infinite loop
        e.target.src = 'path/to/default/image.png'; // Fallback image
      }}
    />
  );
};

// PropTypes validation
Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default Image;
