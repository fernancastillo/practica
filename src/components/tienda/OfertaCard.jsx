import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/tienda/tiendaUtils';

const OfertaCard = ({ oferta, user }) => {
  const calcularAhorro = (precioOriginal, precioOferta) => {
    return precioOriginal - precioOferta;
  };

  // ✅ FUNCIÓN PARA IR AL TOP AL HACER CLIC
  const handleDetailsClick = (e) => {
    // El scroll al top se manejará en la página de destino
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <Card 
      className="h-100 shadow-lg border-0 rounded-4 position-relative overflow-hidden"
      style={{
        background: '#87CEEB',
        transition: 'all 0.4s ease',
        border: '3px solid #000000'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
      }}
    >
      {/* Badges Superiores */}
      <div className="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between align-items-start" style={{ zIndex: 2 }}>
        <div className="d-flex flex-column gap-2">
          <Badge 
            className="fs-6 px-3 py-2 fw-bold border-2 border-white"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
              color: '#FFFFFF'
            }}
          >
            -{oferta.descuento}%
          </Badge>
        </div>
        <Badge 
          className="fs-6 px-3 py-2 fw-bold border-2 border-white"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#FFFFFF',
            backdropFilter: 'blur(10px)'
          }}
        >
          <span style={{ color: '#FFD700' }}>⏰</span> {oferta.tiempoRestante}
        </Badge>
      </div>

      {/* Imagen con fondo del mismo color que la card */}
      <div 
        className="d-flex align-items-center justify-content-center mx-3 mt-3 rounded-4"
        style={{ 
          height: '220px',
          background: '#87CEEB',
          border: '2px solid #000000'
        }}
      >
        <Card.Img 
          variant="top" 
          src={oferta.imagen} 
          style={{
            height: '85%',
            width: 'auto',
            maxWidth: '85%',
            objectFit: 'contain',
            padding: '10px'
          }}
          alt={oferta.nombre}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          className="d-none align-items-center justify-content-center w-100 h-100 rounded-4"
          style={{ 
            backgroundColor: '#87CEEB',
            color: '#000000',
            fontSize: '0.9rem',
            fontFamily: "'Lato', sans-serif",
            border: '2px solid #000000'
          }}
        >
          🖼️ Imagen no disponible
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column p-4">
        {/* Categoría */}
        <div className="mb-3">
          <Badge
            className="fs-6 px-3 py-2 fw-bold border-2 border-dark"
            style={{
              background: '#dedd8ff5',
              color: '#000000'
            }}
          >
            {oferta.categoria}
          </Badge>
        </div>
        
        {/* Nombre del Producto */}
        <Card.Title 
          className="fw-bold mb-3"
          style={{
            fontFamily: "'Indie Flower', cursive",
            fontSize: '1.4rem',
            color: '#000000',
            lineHeight: '1.3'
          }}
        >
          {oferta.nombre}
        </Card.Title>
        
        {/* Descripción */}
        <Card.Text 
          className="mb-4 flex-grow-1"
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: '0.95rem',
            lineHeight: '1.5',
            color: '#000000',
            opacity: 0.9
          }}
        >
          {oferta.descripcion}
        </Card.Text>
        
        <div className="mt-auto">
          {/* Precios */}
          <div 
            className="border-top border-3 border-warning pt-3 mb-4"
            style={{ borderStyle: 'dashed !important' }}
          >
            <div 
              className="fs-6 mb-1"
              style={{
                fontFamily: "'Lato', sans-serif",
                color: '#000000',
                opacity: 0.8,
                textDecoration: 'line-through'
              }}
            >
              Precio original: {formatearPrecio(oferta.precioOriginal)}
            </div>
            <div 
              className="fw-bold mb-2"
              style={{ 
                fontSize: '2rem',
                fontFamily: "'Lato', sans-serif",
                color: '#FF6B6B',
              }}
            >
              {formatearPrecio(oferta.precioOferta)}
            </div>
            <div 
              className="fw-semibold fs-6"
              style={{
                fontFamily: "'Lato', sans-serif",
                color: '#000000',
              }}
            >
              <span style={{ color: '#FFD700' }}>💰</span> Ahorras: {formatearPrecio(calcularAhorro(oferta.precioOriginal, oferta.precioOferta))}
            </div>
          </div>

          {/* Botón con scroll al top */}
          <div className="d-grid">
            <Button 
              variant="light" 
              size="lg"
              className="fw-bold py-3 rounded-3 border-3 border-dark"
              as={Link}
              to={`/producto/${oferta.codigo}`}
              onClick={handleDetailsClick}
              style={{
                background: '#dedd8ff5',
                color: '#000000',
                fontFamily: "'Lato', sans-serif",
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#FFD700';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#dedd8ff5';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Ver Detalles del Producto
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OfertaCard;