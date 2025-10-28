import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';

const OfertasHeader = ({ user }) => {
  return (
    <Row className="mb-5">
      <Col>
        <div className="text-center">
          {/* Imagen en lugar de texto */}
          <img
            src="/src/assets/tienda/ofertas.png"
            alt="Ofertas Especiales"
            className="img-fluid mb-4"
            style={{ 
              maxWidth: '700px',
              width: '100%',
              height: 'auto',
              filter: 'drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.6))'
            }}
            onError={(e) => {
              // Fallback en caso de que la imagen no cargue
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback en caso de error de imagen */}
          <h1 
            className="fw-bold mb-4"
            style={{
              fontFamily: "'Indie Flower', cursive",
              fontSize: '4rem',
              color: '#FFFFFF',
              textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8)',
              marginTop: '2rem',
              display: 'none'
            }}
          >
            🔥 Ofertas Especiales
          </h1>
          
          <p 
            className="fs-4 mb-4"
            style={{
              fontFamily: "'Lato', sans-serif",
              color: '#FFFFFF',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
              fontWeight: '300'
            }}
          >
            Descuentos exclusivos por tiempo limitado
          </p>
          <Badge 
            className="fs-5 px-4 py-3 border-3 border-white fw-bold"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
              color: '#FFFFFF',
              fontFamily: "'Lato', sans-serif"
            }}
          >
            <span style={{ color: '#FFD700' }}>⏰</span> ¡Ofertas terminan pronto!
          </Badge>
        </div>
      </Col>
    </Row>
  );
};

export default OfertasHeader;