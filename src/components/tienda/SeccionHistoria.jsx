// src/components/tienda/SeccionHistoria.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import CardNosotros from './CardNosotros';
import ImagenNosotros from './ImagenNosotros';
// Cambiar la importación de la imagen
import historiaImage from '../../assets/tienda/junimoshop.png'; // ✅ IMAGEN CAMBIADA

const SeccionHistoria = () => {
  return (
    <Row className="mb-5">
      <Col lg={8} className="mx-auto">
        <CardNosotros>
          <Card.Body className="p-4">
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
              Nuestra Historia
            </h2>
            
            <div className="text-center mb-4">
              <ImagenNosotros 
                src={historiaImage} // ✅ USA LA NUEVA IMAGEN
                alt="Junimo Shop - Nuestra historia"
                maxWidth="260px"
                height="190px"
              />
            </div>
            
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: '#000000',
              marginBottom: '1rem'
            }}>
              Junimos Store nació del amor compartido por Stardew Valley, ese mágico lugar 
              donde podemos escapar de la rutina y construir nuestra granja soñada. Como 
              verdaderos fans del juego, entendemos la magia que envuelve cada detalle del 
              valle y queremos llevar esa experiencia a tu vida cotidiana.
            </p>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: '#000000',
              marginBottom: '0'
            }}>
              Somos una iniciativa de fanáticos para fanáticos, creada por jugadores 
              apasionados que queremos compartir nuestro entusiasmo por este maravilloso 
              mundo. Aunque no tenemos una ubicación física, nuestro corazón está en cada 
              producto que enviamos a lo largo de todo Chile.
            </p>
          </Card.Body>
        </CardNosotros>
      </Col>
    </Row>
  );
};

export default SeccionHistoria;