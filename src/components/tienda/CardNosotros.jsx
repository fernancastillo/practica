// src/components/tienda/CardNosotros.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const CardNosotros = ({ children, className = '' }) => {
  return (
    <Card 
      className={`shadow ${className}`}
      style={{
        background: '#87CEEB',
        borderRadius: '20px',
        border: '3px solid #dedd8ff5',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = '#FFFFFF';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#dedd8ff5';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
      }}
    >
      {children}
    </Card>
  );
};

export default CardNosotros;