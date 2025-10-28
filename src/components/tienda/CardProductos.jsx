import React from 'react';
import { Col, Card, Button, Badge } from 'react-bootstrap';
import { formatearPrecio, handleImageError } from '../../utils/tienda/tiendaUtils';

const CardProductos = ({ product, onDetailsClick, calcularPorcentajeDescuento, getProductosEnOferta }) => {
  // Verificar si el producto está en oferta
  const productosEnOferta = getProductosEnOferta();
  const estaEnOferta = productosEnOferta.some(p => p.codigo === product.codigo);
  
  // Calcular porcentaje de descuento
  const porcentajeDescuento = estaEnOferta && product.precioOriginal 
    ? calcularPorcentajeDescuento(product.precioOriginal, product.precioOferta || product.precio)
    : 0;

  return (
    <Col key={product.codigo} xl={3} lg={4} md={6} className="mb-4">
      <Card 
        className="h-100 product-card shadow-sm border-0 position-relative"
        style={{ 
          transition: 'all 0.3s ease',
          backgroundColor: '#87CEEB'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
        }}
      >
        {/* Badge de descuento */}
        {estaEnOferta && porcentajeDescuento > 0 && (
          <Badge 
            bg="danger"
            className="position-absolute top-0 start-0 m-2 fs-6 px-2 py-2"
            style={{
              zIndex: 1,
              fontWeight: 'bold'
            }}
          >
            -{porcentajeDescuento}%
          </Badge>
        )}

        <Card.Img 
          variant="top" 
          src={product.imagen} 
          style={{ 
            height: '180px',
            objectFit: 'contain',
            backgroundColor: 'transparent',
            padding: '10px'
          }}
          onError={(e) => handleImageError(e, product.nombre)}
        />
        <Card.Body className="d-flex flex-column text-black">
          <Card.Title 
            className="fw-bold mb-2"
            style={{ 
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem',
              minHeight: '50px'
            }}
          >
            {product.nombre}
          </Card.Title>
          
          <Card.Text 
            className="small flex-grow-1"
            style={{ minHeight: '60px' }}
          >
            {product.descripcion.length > 80 
              ? `${product.descripcion.substring(0, 80)}...` 
              : product.descripcion
            }
          </Card.Text>

          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                {estaEnOferta && product.precioOferta ? (
                  <>
                    {/* Precio oferta en ROJO */}
                    <span className="text-danger fw-bold fs-5">
                      {formatearPrecio(product.precioOferta)}
                    </span>
                    {/* Precio original tachado */}
                    <span className="text-dark text-decoration-line-through small ms-2" style={{opacity: 0.8}}>
                      {formatearPrecio(product.precioOriginal || product.precio)}
                    </span>
                  </>
                ) : (
                  <span className="fw-bold fs-5 text-dark">
                    {formatearPrecio(product.precio)}
                  </span>
                )}
              </div>
              <Badge 
                style={{ 
                  backgroundColor: '#dedd8ff5',
                  color: '#000000',
                  border: 'none'
                }} 
                className="fs-7"
              >
                {product.stock_disponible > 0 ? `Stock: ${product.stock_disponible}` : 'Sin Stock'}
              </Badge>
            </div>

            {/* Solo botón de detalles */}
            <div className="d-flex gap-2">
              <Button
                style={{ 
                  backgroundColor: '#dedd8ff5',
                  color: '#000000',
                  border: '2px solid #000000',
                  fontWeight: 'bold'
                }}
                size="sm"
                className="w-100"
                onClick={() => onDetailsClick(product.codigo)}
              >
                Ver Detalles
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CardProductos;