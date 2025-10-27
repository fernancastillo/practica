import React from 'react';
import { Row, Col } from 'react-bootstrap';

const ProductoDetalleHeader = () => {
  return (
    <Row className="mb-4">
      <Col>
        <div className="text-center mb-4">
          <img
            src="../src/assets/tienda/productos.png"
            alt="Nuestros Productos"
            className="img-fluid rounded-4"
            style={{ 
              maxHeight: '200px',
              width: 'auto'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x120/87CEEB/000000?text=Nuestros+Productos';
              console.log('Error cargando imagen de productos');
            }}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ProductoDetalleHeader;