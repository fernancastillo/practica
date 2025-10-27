// src/components/tienda/SeccionValores.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CardNosotros from './CardNosotros';
import ImagenNosotros from './ImagenNosotros';
import pasionImage from '../../assets/tienda/caffe.png';
import comunidadImage from '../../assets/tienda/comunidad.png';
import calidadImage from '../../assets/tienda/junimoss.png';

const SeccionValores = () => {
  const valores = [
    {
      imagen: pasionImage,
      titulo: 'Pasión',
      texto: 'Amamos Stardew Valley tanto como tú y eso se refleja en cada producto',
      maxWidth: '110px',
      height: '80px'
    },
    {
      imagen: comunidadImage,
      titulo: 'Comunidad',
      texto: 'Creemos en el poder de unir a los jugadores chilenos del valle',
      maxWidth: '110px',
      height: '80px'
    },
    {
      imagen: calidadImage,
      titulo: 'Calidad',
      texto: 'Solo ofrecemos productos que cumplen con nuestros altos estándares',
      maxWidth: '110px',
      height: '80px'
    }
  ];

  return (
    <Row className="mb-5">
      <Col>
        <CardNosotros>
          <div className="p-4">
            <h2 
              style={{
                fontFamily: "'Indie Flower', cursive",
                fontSize: '2.2rem',
                color: '#000000',
                marginBottom: '2rem',
                fontWeight: '700',
                textAlign: 'center'
              }}
            >
              Nuestros Valores
            </h2>
            <Row>
              {valores.map((valor, index) => (
                <Col md={4} className="text-center mb-4" key={index}>
                  <div style={{ padding: '1rem' }}>
                    <ImagenNosotros 
                      src={valor.imagen}
                      alt={`${valor.titulo} - Stardew Valley`}
                      maxWidth={valor.maxWidth}
                      height={valor.height}
                    />
                    <h4 style={{
                      fontFamily: "'Indie Flower', cursive",
                      fontSize: '1.8rem',
                      color: '#000000',
                      marginBottom: '1rem',
                      fontWeight: '700'
                    }}>
                      {valor.titulo}
                    </h4>
                    <p style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: '1rem',
                      color: '#000000',
                      lineHeight: '1.6',
                      marginBottom: '0'
                    }}>
                      {valor.texto}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </CardNosotros>
      </Col>
    </Row>
  );
};

export default SeccionValores;