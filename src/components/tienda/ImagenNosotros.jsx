import React from 'react';

const ImagenNosotros = ({ src, alt, maxWidth = '220px', height = '160px', className = '' }) => {
  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      style={{
        width: '100%',
        maxWidth: maxWidth,
        height: height,
        objectFit: 'contain',
        borderRadius: '10px',
        transition: 'all 0.3s ease'
      }}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    />
  );
};

export default ImagenNosotros;