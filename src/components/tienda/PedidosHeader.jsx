import React from 'react';
import { Row, Col } from 'react-bootstrap';

// Importar la imagen de pedidos
import pedidosImage from '../../assets/tienda/pedidos.png';

const PedidosHeader = () => {
  return (
    <Row className="mb-4">
      <Col>
        <div className="text-center">
          {/* Imagen del header */}
          <div className="mb-3">
            <img
              src={pedidosImage}
              alt="Mis Pedidos - Junimo Store"
              className="img-fluid"
              style={{
                maxWidth: '600px',
                width: '100%',
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))'
              }}
              onError={(e) => {
                // Fallback si la imagen no carga
                e.target.style.display = 'none';
                // Mostrar texto alternativo
                const fallbackElement = document.getElementById('fallback-title');
                if (fallbackElement) {
                  fallbackElement.style.display = 'block';
                }
              }}
            />
          </div>
          
          {/* Texto alternativo que se muestra si la imagen no carga */}
          <h1 
            id="fallback-title"
            className="text-center mb-3"
            style={{
              fontFamily: "'Indie Flower', cursive",
              color: '#000000',
              fontWeight: 'bold',
              fontSize: '2.5rem',
              textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
              display: 'none'
            }}
          >
            📦 Mis Pedidos
          </h1>
          
          <p 
            className="text-center fs-5"
            style={{
              color: '#FFFFFF',
              fontWeight: '500',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
              fontFamily: "'Lato', sans-serif"
            }}
          >
            Revisa el estado de tus compras realizadas
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default PedidosHeader;