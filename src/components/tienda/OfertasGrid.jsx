// src/components/tienda/ofertas/OfertasGrid.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import OfertaCard from './OfertaCard';

const OfertasGrid = ({ ofertas, user }) => {
  return (
    <>
      <Row className="g-4">
        {ofertas.map(oferta => (
          <Col key={oferta.id} xl={3} lg={4} md={6}>
            <OfertaCard 
              oferta={oferta}
              user={user}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default OfertasGrid;