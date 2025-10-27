import React from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';

const ProductoDetalleRelated = ({ 
  relatedProducts, 
  handleRelatedProductClick, 
  formatearPrecio, 
  categoryIcons 
}) => {
  return (
    <Row className="mt-5">
      <Col>
        <div className="py-4">
          <h3 
            className="text-center fw-bold mb-5 display-4"
            style={{ 
              color: 'white',
              fontFamily: "'Indie Flower', cursive",
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)'
            }}
          >
            Productos Relacionados
          </h3>
          <Row>
            {relatedProducts.map(relatedProduct => (
              <Col key={relatedProduct.codigo} lg={3} md={6} className="mb-4">
                <RelatedProductCard 
                  product={relatedProduct}
                  handleRelatedProductClick={handleRelatedProductClick}
                  formatearPrecio={formatearPrecio}
                  categoryIcons={categoryIcons}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Col>
    </Row>
  );
};

const RelatedProductCard = ({ product, handleRelatedProductClick, formatearPrecio, categoryIcons }) => (
  <Card 
    className="h-100 shadow-sm border-3 border-primary rounded-4 overflow-hidden transition-all"
    style={{ 
      borderColor: '#87CEEB !important',
      backgroundColor: '#87CEEB'
    }}
  >
    <div className="d-flex align-items-center justify-content-center p-4">
      <Card.Img 
        variant="top" 
        src={product.imagen} 
        style={{ 
          height: '220px', 
          objectFit: 'contain',
          maxWidth: '100%'
        }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200/2E8B57/000000?text=Imagen+No+Disponible';
        }}
      />
    </div>
    <Card.Body className="d-flex flex-column">
      <Badge 
        className="mb-2 px-3 py-2 rounded-3 border-2 border-dark fw-bold"
        style={{ 
          background: 'linear-gradient(135deg, #2E8B57, #3CB371)',
          color: '#000000'
        }}
      >
        {categoryIcons[product.categoria]} {product.categoria}
      </Badge>
      <Card.Title 
        className="h6 fw-bold mb-3 flex-grow-1 text-dark"
        style={{ 
          fontFamily: "'Lato', sans-serif",
          textShadow: '1px 1px 2px rgba(255,255,255,0.5)'
        }}
      >
        {product.nombre}
      </Card.Title>
      <div className="mt-auto">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span 
            className="fw-bold text-dark"
            style={{ 
              fontSize: '1.2rem',
              fontFamily: "'Lato', sans-serif",
              textShadow: '1px 1px 2px rgba(255,255,255,0.5)'
            }}
          >
            {formatearPrecio(product.precio)}
          </span>
        </div>
        <Button 
          variant="outline-dark" 
          size="sm"
          className="w-100 rounded-3 fw-bold border-2"
          style={{ 
            fontFamily: "'Lato', sans-serif",
            color: '#000000',
            backgroundColor: '#dedd8ff5'
          }}
          onClick={() => handleRelatedProductClick(product.codigo)}
        >
          Ver Detalles
        </Button>
      </div>
    </Card.Body>
  </Card>
);

export default ProductoDetalleRelated;