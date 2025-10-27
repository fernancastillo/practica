// src/pages/tienda/Nosotros.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

// Componentes
import HeaderNosotros from '../../components/tienda/HeaderNosotros';
import SeccionHistoria from '../../components/tienda/SeccionHistoria';
import SeccionMisionVision from '../../components/tienda/SeccionMisionVision';
import SeccionValores from '../../components/tienda/SeccionValores';
import SeccionComunidad from '../../components/tienda/SeccionComunidad';
import CallToAction from '../../components/tienda/CallToAction';

const Nosotros = () => {
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
      {/* ESPACIO PARA EL NAVBAR FIXED */}
      <div style={{ height: '80px' }}></div>

      <Container className="py-5">
        <HeaderNosotros />
        <SeccionHistoria />
        <SeccionMisionVision />
        <SeccionValores />
        <SeccionComunidad />
        <CallToAction />
      </Container>
    </div>
  );
};

export default Nosotros;