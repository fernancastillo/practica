import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyOrders = ({ user }) => {
  return (
    <Card 
      className="text-center py-5 shadow-lg border-3 border-dark rounded-4"
      style={{
        backgroundColor: '#87CEEB',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <Card.Body>
        <div className="display-1 mb-3">📭</div>
        <h4>No tienes pedidos realizados</h4>
        <p className="text-muted mb-4">
          {user.run ? `RUN: ${user.run}` : 'Usuario sin RUN registrado'}
        </p>
        <Button 
          as={Link} 
          to="/index" 
          variant="warning" 
          size="lg"
          className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
          style={{
            backgroundColor: '#dedd8ff5',
            color: '#000000',
            transition: 'all 0.3s ease',
            fontFamily: "'Lato', sans-serif"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(222, 221, 143, 0.6)';
            e.target.style.backgroundColor = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
            e.target.style.backgroundColor = '#dedd8ff5';
          }}
        >
          Comprar Ahora
        </Button>
      </Card.Body>
    </Card>
  );
};

export default EmptyOrders;