import React from 'react';
import { Form } from 'react-bootstrap';

const Preferencias = () => {
  return (
    <>
      <h5 
        className="mb-4 fw-bold"
        style={{ 
          color: '#000000',
          fontFamily: "'Lato', sans-serif",
          fontSize: '1.3rem'
        }}
      >
        Configuración de Notificaciones
      </h5>
      <Form>
        <div className="mb-3 p-3 border-3 border-dark rounded-3" style={{ backgroundColor: '#FFFFFF' }}>
          <Form.Check
            type="switch"
            id="email-notifications"
            label={
              <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: '500', color: '#000000' }}>
                Recibir notificaciones por email
              </span>
            }
            defaultChecked
          />
        </div>
        <div className="mb-3 p-3 border-3 border-dark rounded-3" style={{ backgroundColor: '#FFFFFF' }}>
          <Form.Check
            type="switch"
            id="promo-notifications"
            label={
              <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: '500', color: '#000000' }}>
                Recibir promociones y ofertas
              </span>
            }
            defaultChecked
          />
        </div>
        <div className="mb-3 p-3 border-3 border-dark rounded-3" style={{ backgroundColor: '#FFFFFF' }}>
          <Form.Check
            type="switch"
            id="order-updates"
            label={
              <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: '500', color: '#000000' }}>
                Actualizaciones de pedidos
              </span>
            }
            defaultChecked
          />
        </div>
      </Form>
    </>
  );
};

export default Preferencias;