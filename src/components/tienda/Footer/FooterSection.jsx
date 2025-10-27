import React from 'react';

const FooterSection = ({ title, children, className = '' }) => {
  return (
    <div className={`footer-section ${className}`}>
      <h5>{title}</h5>
      {children}
    </div>
  );
};

export default FooterSection;