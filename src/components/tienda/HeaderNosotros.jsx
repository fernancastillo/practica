import React from 'react';
import { Row, Col } from 'react-bootstrap';
import nosotrosImage from '../../assets/tienda/nosotros.png';

const HeaderNosotros = () => {
  return (
    <Row className="mb-5">
      <Col>
        <div className="text-center">
          {/* Imagen del header */}
          <div className="mb-3">
            <img
              src={nosotrosImage}
              alt="Sobre Junimos Store"
              className="img-fluid"
              style={{
                maxWidth: '800px',
                width: '100%',
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x200/87CEEB/FFFFFF?text=Sobre+Junimos+Store';
              }}
            />
          </div>
          
          {/* Texto descriptivo debajo de la imagen */}
          <p 
            className="fs-4 mt-3"
            style={{
              fontFamily: "'Lato', sans-serif",
              color: '#FFFFFF', // Blanco
              fontWeight: '300',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}
          >
            Tu tienda oficial de Stardew Valley en Chile
          </p>
        </div>
      </Col>
    </Row>
  );
};

export default HeaderNosotros;