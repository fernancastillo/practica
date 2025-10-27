// src/components/tienda/SeccionComunidad.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CardNosotros from './CardNosotros';
import ImagenNosotros from './ImagenNosotros';
import uneteImage from '../../assets/tienda/comunidad.png';

const SeccionComunidad = () => {
  return (
    <Row className="mb-5">
      <Col lg={10} className="mx-auto">
        <CardNosotros>
          <div className="p-4">
            <h2 
              style={{
                fontFamily: "'Indie Flower', cursive",
                fontSize: '2.2rem',
                color: '#000000',
                marginBottom: '1.5rem',
                fontWeight: '700',
                textAlign: 'center'
              }}
            >
              Únete a Nuestra Comunidad
            </h2>
            
            <div className="text-center mb-4">
              <ImagenNosotros 
                src={uneteImage}
                alt="Únete a nuestra comunidad de Stardew Valley"
              />
            </div>
            
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: '#000000',
              marginBottom: '0',
              textAlign: 'center'
            }}>
              En Junimos Store no solo vendemos productos, creamos experiencias. 
              Formamos parte de una comunidad vibrante de jugadores que comparten 
              consejos, historias y su amor por Stardew Valley.
            </p>
          </div>
        </CardNosotros>
      </Col>
    </Row>
  );
};

export default SeccionComunidad;