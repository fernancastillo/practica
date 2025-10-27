// src/components/tienda/ofertas/OfertasInfoCard.jsx
import React from 'react';
import { Row, Col, Card, Alert, Button } from 'react-bootstrap';

const OfertasInfoCard = ({ user, ofertasCount, navigate }) => {
  return (
    <Row className="mb-5">
      <Col>
        <Card 
          className="rounded-4 border-0 shadow-lg overflow-hidden"
          style={{
            background: '#87CEEB',
            border: '3px solid #000000'
          }}
        >
          <Card.Body className="text-center p-5">
            <h4 
              className="fw-bold mb-4"
              style={{
                fontFamily: "'Indie Flower', cursive",
                fontSize: '2.5rem',
                color: '#000000',
              }}
            >
              <span style={{ color: '#FFD700' }}>🎁</span> ¡Aprovecha Estas Ofertas!
            </h4>
            <Row>
              <Col md={4}>
                <div className="text-center">
                  <h3 
                    className="fw-bold mb-2"
                    style={{ 
                      color: '#FF6B6B', 
                      fontSize: '2.5rem',
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    {ofertasCount}
                  </h3>
                  <p 
                    className="mb-0 fw-semibold"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      color: '#000000',
                      fontSize: '1.1rem'
                    }}
                  >
                    Ofertas Activas
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <h3 
                    className="fw-bold mb-2"
                    style={{ 
                      color: '#FF6B6B', 
                      fontSize: '2.5rem',
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    Hasta 35%
                  </h3>
                  <p 
                    className="mb-0 fw-semibold"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      color: '#000000',
                      fontSize: '1.1rem'
                    }}
                  >
                    Descuento
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <h3 
                    className="fw-bold mb-2"
                    style={{ 
                      color: '#FF6B6B', 
                      fontSize: '2.5rem',
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    <span style={{ color: '#FFD700' }}>🕒</span>
                  </h3>
                  <p 
                    className="mb-0 fw-semibold"
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      color: '#000000',
                      fontSize: '1.1rem'
                    }}
                  >
                    Tiempo Limitado
                  </p>
                </div>
              </Col>
            </Row>
            {!user && (
              <Alert variant="info" className="mt-4 mb-0 border-3 border-dark">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="me-2 fs-5" style={{ color: '#FFD700' }}>🔐</span>
                  <span
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      color: '#000000',
                      fontWeight: '500'
                    }}
                  >
                    <strong>Inicia sesión</strong> para ver los detalles de los productos y realizar compras.
                  </span>
                </div>
                <div className="text-center mt-3">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="fw-bold px-4 py-2 border-3 border-dark"
                    onClick={() => navigate('/login')}
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      background: '#dedd8ff5',
                      color: '#000000'
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OfertasInfoCard;