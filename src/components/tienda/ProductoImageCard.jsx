import React from 'react';
import { Card } from 'react-bootstrap';

const ProductoImageCard = ({ product }) => {
  return (
    <Card 
      className="border-3 border-primary rounded-4 shadow-lg overflow-hidden transition-all"
      style={{ 
        borderColor: '#87CEEB !important',
        backgroundColor: '#87CEEB'
      }}
    >
      <div className="d-flex align-items-center justify-content-center p-5">
        <img 
          src={product.imagen} 
          alt={product.nombre}
          className="img-fluid w-100"
          style={{ 
            maxHeight: '500px', 
            objectFit: 'contain',
            maxWidth: '100%'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x600/2E8B57/000000?text=Imagen+No+Disponible';
          }}
        />
      </div>
    </Card>
  );
};

export default ProductoImageCard;