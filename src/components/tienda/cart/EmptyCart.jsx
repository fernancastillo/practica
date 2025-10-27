// src/components/tienda/EmptyCart.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <Container className="text-center py-5">
      <Row>
        <Col>
          <div className="empty-cart-icon display-1 mb-4">🛒</div>
          <h3 className="text-muted mb-3">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">
            ¡Descubre nuestros productos exclusivos de Stardew Valley!
          </p>
          <Button as={Link} to="/productos" variant="warning" size="lg">
            🌾 Explorar Productos
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default EmptyCart;