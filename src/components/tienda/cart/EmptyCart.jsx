import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Importar la misma imagen del carrito
import carritoImage from '../../../assets/tienda/carrito.png';

const EmptyCart = () => {
  return (
    <Container 
      className="text-center py-5"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <Row>
        <Col>
          {/* Imagen del carrito en lugar del emoji */}
          <div className="mb-4">
            <img
              src={carritoImage}
              alt="Carrito Vacío"
              className="img-fluid"
              style={{
                maxWidth: '600px',
                width: '100%',
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))',
                opacity: '0.8'
              }}
              onError={(e) => {
                // Fallback si la imagen no carga - mostrar el emoji original
                e.target.style.display = 'none';
                const fallbackElement = document.getElementById('fallback-emoji');
                if (fallbackElement) {
                  fallbackElement.style.display = 'block';
                }
              }}
            />
          </div>
          
          {/* Emoji fallback que se muestra si la imagen no carga */}
          <div 
            id="fallback-emoji"
            className="display-1 mb-4"
            style={{
              color: '#000000',
              textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)',
              animation: 'float 3s ease-in-out infinite',
              display: 'none' // Oculto por defecto
            }}
          >
            🛒
          </div>
          
          <h3 
            className="mb-3 fw-bold"
            style={{
              fontFamily: "'Indie Flower', cursive",
              color: '#000000',
              fontSize: '2.5rem',
              textShadow: '2px 2px 4px rgba(255, 255, 255, 0.7)'
            }}
          >
            Tu carrito está vacío
          </h3>
          <p 
            className="mb-4 fs-5 fw-semibold"
            style={{
              color: '#000000',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.6)'
            }}
          >
            ¡Descubre nuestros productos exclusivos de Stardew Valley!
          </p>
          <Button 
            as={Link} 
            to="/productos" 
            variant="warning" 
            size="lg"
            className="rounded-pill px-5 py-3 fw-bold border-3 border-dark"
            style={{
              background: '#dedd8ff5',
              color: '#000000',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(222, 221, 143, 0.6)';
              e.currentTarget.style.backgroundColor = '#FFD700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.backgroundColor = '#dedd8ff5';
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