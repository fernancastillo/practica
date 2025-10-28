import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductoImageCard from './ProductoImageCard';
import ProductoInfoCard from './ProductoInfoCard';

const ProductoDetalleMain = ({ 
  product, 
  cantidad, 
  setCantidad, 
  handleAddToCart, 
  formatearPrecio, 
  categoryIcons,
  user // ✅ AGREGAR ESTA PROP
}) => {
  return (
    <Row className="mb-5">
      <Col lg={6} className="mb-4">
        <ProductoImageCard product={product} />
      </Col>
      
      <Col lg={6}>
        <ProductoInfoCard 
          product={product}
          cantidad={cantidad}
          setCantidad={setCantidad}
          handleAddToCart={handleAddToCart}
          formatearPrecio={formatearPrecio}
          categoryIcons={categoryIcons}
          user={user} // ✅ PASAR LA PROP AL COMPONENTE HIJO
        />
      </Col>
    </Row>
  );
};

export default ProductoDetalleMain;