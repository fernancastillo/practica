import React from 'react';
import { Col, Card, Button, Badge } from 'react-bootstrap';

const CategoryCard = ({ categoria, onCategoryClick }) => {
  return (
    <Col xl={3} lg={4} md={6} className="mb-4">
      <Card 
        className="h-100 category-card shadow-sm border-0"
        style={{ 
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: '#87CEEB',
          backdropFilter: 'blur(10px)'
        }}
        onClick={() => onCategoryClick(categoria)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        }}
      >
        <Card.Body className="text-center p-4 d-flex flex-column justify-content-center">
          <Card.Title 
            className="fw-bold mb-2 text-black"
            style={{ 
              fontFamily: "'Indie Flower', cursive",
              fontSize: '1.5rem'
            }}
          >
            {categoria.nombre}
          </Card.Title>
          <Card.Text>
            <Badge 
              style={{ 
                backgroundColor: '#dedd8ff5',
                color: '#000000',
                border: 'none'
              }} 
              className="fs-6"
            >
              {categoria.cantidadProductos} producto{categoria.cantidadProductos !== 1 ? 's' : ''}
            </Badge>
          </Card.Text>
          <Button 
            style={{ 
              backgroundColor: '#dedd8ff5',
              color: '#000000',
              border: '2px solid #000000',
              fontWeight: 'bold'
            }}
            className="mt-2"
          >
            Ver Productos
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CategoryCard;