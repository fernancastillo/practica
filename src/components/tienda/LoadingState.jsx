import React from 'react';
import { Container } from 'react-bootstrap';

const LoadingState = () => {
  return (
    <div 
      className="min-vh-100 w-100"
      style={{
        backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <div style={{ height: '80px' }}></div>
      <Container className="text-center py-5">
        <div className="display-1 mb-3">🌾</div>
        <h4 className="text-white">Cargando perfil...</h4>
      </Container>
    </div>
  );
};

export default LoadingState;