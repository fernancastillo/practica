import React from 'react';
import { Row, Col } from 'react-bootstrap';
import loginImage from '../../assets/tienda/login.png';

const LoginHeader = () => {
  return (
    <Row className="justify-content-center mb-4">
      <Col md={8} lg={6}>
        <div className="text-center">
          <div className="mb-3">
            <img
              src={loginImage}
              alt="Iniciar Sesión - Junimo Store"
              className="img-fluid"
              style={{
                maxWidth: '400px',
                width: '100%',
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                const fallbackElement = document.getElementById('fallback-title');
                if (fallbackElement) {
                  fallbackElement.style.display = 'block';
                }
              }}
            />
          </div>
          
          <h2 
            id="fallback-title"
            className="fw-bold mb-3"
            style={{
              fontFamily: "'Indie Flower', cursive",
              color: '#000000',
              fontSize: '2.5rem',
              textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
              display: 'none'
            }}
          >
            Iniciar Sesión
          </h2>
          
          <p 
            className="fs-5"
            style={{
              color: '#000000',
              fontWeight: '500',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.7)'
            }}
          >
            Ingresa a tu cuenta de Junimo Store
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default LoginHeader;