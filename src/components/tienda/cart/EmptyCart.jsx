// src/components/tienda/cart/EmptyCart.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <Container 
      className="text-center py-5"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <Row>
        <Col>
          <div 
            className="display-1 mb-4"
            style={{
              color: '#dedd8f',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            🛒
          </div>
          <h3 
            className="mb-3"
            style={{
              fontFamily: "'Indie Flower', cursive",
              color: '#dedd8f',
              fontSize: '2.5rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            Tu carrito está vacío
          </h3>
          <p 
            className="mb-4 fs-5"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
            }}
          >
            ¡Descubre nuestros productos exclusivos de Stardew Valley!
          </p>
          <Button 
            as={Link} 
            to="/productos" 
            variant="warning" 
            size="lg"
            className="rounded-pill px-5 py-3 fw-bold border-2 border-white"
            style={{
              background: 'linear-gradient(135deg, #dedd8f, #f0efb8)',
              color: '#000000',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(222, 221, 143, 0.6)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f0efb8, #ffffd0)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = 'linear-gradient(135deg, #dedd8f, #f0efb8)';
            }}
          >
            🌾 Explorar Productos
          </Button>
        </Col>
      </Row>

      {/* Estilos de animación en línea */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </Container>
  );
};

export default EmptyCart;