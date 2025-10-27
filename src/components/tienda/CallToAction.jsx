// src/components/tienda/CallToAction.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CardNosotros from './CardNosotros';

const CallToAction = () => {
  return (
    <Row>
      <Col>
        <CardNosotros>
          <div className="p-4 text-center">
            <h2 
              style={{
                fontFamily: "'Indie Flower', cursive",
                fontSize: '2.2rem',
                color: '#000000',
                marginBottom: '1.5rem',
                fontWeight: '700'
              }}
            >
              ¿Listo para Explorar el Valle?
            </h2>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: '#000000',
              marginBottom: '2rem'
            }}>
              Descubre nuestra colección de productos inspirados en Stardew Valley y 
              lleva un pedacito del valle a tu hogar.
            </p>
            <Link 
              to="/productos" 
              className="btn btn-lg fw-bold"
              style={{
                background: '#dedd8ff5',
                border: '3px solid #000000',
                color: '#000000',
                borderRadius: '15px',
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#FFFFFF';
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 25px rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#dedd8ff5';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🛍️ Ver Productos
            </Link>
          </div>
        </CardNosotros>
      </Col>
    </Row>
  );
};

export default CallToAction;