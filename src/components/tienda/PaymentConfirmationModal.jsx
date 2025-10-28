// src/components/tienda/payment/PaymentConfirmationModal.jsx
import React from 'react';
import { Modal, Button, Row, Col, Alert } from 'react-bootstrap';

const PaymentConfirmationModal = ({ show, onHide, onContinue, totalFinal }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <Modal.Header 
        className="border-3 border-dark"
        style={{
          backgroundColor: '#87CEEB',
        }}
      >
        <Modal.Title className="fw-bold w-100 text-center" style={{ color: '#000000' }}>
          <span style={{ fontFamily: "'Indie Flower', cursive", fontSize: '1.8rem' }}>
            💳 Método de Pago
          </span>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body
        style={{
          backgroundColor: '#87CEEB',
        }}
      >
        <div className="text-center">
          <div className="mb-4">
            <div 
              className="display-1 mb-3"
              style={{ color: '#000000' }}
            >
              💳
            </div>
            <h4 
              className="fw-bold mb-3"
              style={{ 
                color: '#000000',
                fontFamily: "'Lato', sans-serif"
              }}
            >
              Información Importante
            </h4>
          </div>

          <Alert 
            variant="info" 
            className="border-3 border-dark rounded-3 mb-4"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000',
              fontWeight: '600'
            }}
          >
            <div className="text-start">
              <h6 className="fw-bold mb-3">📋 Por el momento solo aceptamos:</h6>
              <ul className="mb-0">
                <li>💳 <strong>Tarjetas de Crédito</strong> (Visa, MasterCard, American Express)</li>
                <li>🛡️ <strong>Pago seguro</strong> con encriptación SSL</li>
                <li>✅ <strong>Transacciones verificadas</strong> por sistema antifraude</li>
              </ul>
            </div>
          </Alert>

          <div 
            className="p-3 rounded-3 border-3 border-dark mb-4"
            style={{
              backgroundColor: '#90EE90',
              color: '#000000'
            }}
          >
            <Row className="align-items-center">
              <Col>
                <h5 className="fw-bold mb-1" style={{ color: '#000000' }}>
                  Total a Pagar
                </h5>
                <div className="fs-4 fw-bold" style={{ color: '#000000' }}>
                  ${totalFinal.toLocaleString('es-CL')}
                </div>
              </Col>
              <Col xs="auto">
                <div 
                  className="display-4"
                  style={{ color: '#000000' }}
                >
                  💰
                </div>
              </Col>
            </Row>
          </div>

          <div 
            className="small p-2 rounded-3 border-2 border-dark"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000'
            }}
          >
            <strong>⚠️ Importante:</strong> Tus datos de pago están protegidos y no se almacenan en nuestros servidores.
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer
        className="border-3 border-dark"
        style={{
          backgroundColor: '#87CEEB',
        }}
      >
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
          style={{
            backgroundColor: '#dedd8ff5',
            color: '#000000',
            minWidth: '120px'
          }}
        >
          ← Volver
        </Button>
        <Button 
          variant="success" 
          onClick={onContinue}
          className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
          style={{
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            color: '#FFFFFF',
            minWidth: '120px',
            border: 'none'
          }}
        >
          Continuar →
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentConfirmationModal;