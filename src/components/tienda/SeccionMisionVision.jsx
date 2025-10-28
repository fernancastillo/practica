import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CardNosotros from './CardNosotros';
import ImagenNosotros from './ImagenNosotros';
import misionImage from '../../assets/tienda/junimo.png';
import visionImage from '../../assets/tienda/gallina.png';

const SeccionMisionVision = () => {
  return (
    <Row className="mb-5">
      <Col md={6} className="mb-4">
        <CardNosotros className="h-100">
          <div className="p-4 d-flex flex-column h-100">
            <div className="text-center mb-3">
              <ImagenNosotros 
                src={misionImage}
                alt="Junimo - Nuestra misión"
              />
            </div>
            
            <h3 style={{
              fontFamily: "'Indie Flower', cursive",
              fontSize: '2.2rem',
              color: '#000000',
              marginBottom: '1.5rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Misión
            </h3>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: '#000000',
              marginBottom: '0',
              textAlign: 'center',
              flexGrow: '1'
            }}>
              Ofrecer productos y experiencias de alta calidad para los fans de Stardew Valley, 
              con un enfoque en la autenticidad, la creatividad y la construcción de comunidad.
            </p>
          </div>
        </CardNosotros>
      </Col>
      
      <Col md={6} className="mb-4">
        <CardNosotros className="h-100">
          <div className="p-4 d-flex flex-column h-100">
            <div className="text-center mb-3">
              <ImagenNosotros 
                src={visionImage}
                alt="Gallina de Stardew Valley - Nuestra visión"
              />
            </div>
            
            <h3 style={{
              fontFamily: "'Indie Flower', cursive",
              fontSize: '2.2rem',
              color: '#000000',
              marginBottom: '1.5rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Visión
            </h3>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: '#000000',
              marginBottom: '0',
              textAlign: 'center',
              flexGrow: '1'
            }}>
              Ser la tienda online líder en Chile para la comunidad de Stardew Valley, 
              reconocida por su cercanía, originalidad, y programas de fidelización que 
              premien a los jugadores más comprometidos.
            </p>
          </div>
        </CardNosotros>
      </Col>
    </Row>
  );
};

export default SeccionMisionVision;