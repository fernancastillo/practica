// src/components/tienda/payment/PaymentSuccessModal.jsx
import React from 'react';
import { Modal, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PaymentSuccessModal = ({ show, onHide, orderNumber, total, transactionId }) => {
  // Validar que los datos estén disponibles antes de renderizar
  if (!orderNumber || total === undefined || total === null) {
    return null; // No renderizar si faltan datos críticos
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <Modal.Header 
        className="border-3 border-success"
        style={{
          backgroundColor: '#90EE90',
        }}
      >
        <Modal.Title className="fw-bold w-100 text-center" style={{ color: '#000000' }}>
          <span style={{ fontFamily: "'Indie Flower', cursive", fontSize: '1.8rem' }}>
            🎉 ¡Pago Exitoso!
          </span>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body
        style={{
          backgroundColor: '#90EE90',
        }}
      >
        <div className="text-center">
          <div className="mb-4">
            <div 
              className="display-1 mb-3"
              style={{ color: '#000000' }}
            >
              ✅
            </div>
            <h4 
              className="fw-bold mb-3"
              style={{ 
                color: '#000000',
                fontFamily: "'Lato', sans-serif"
              }}
            >
              ¡Tu compra ha sido procesada exitosamente!
            </h4>
          </div>

          <Alert 
            variant="success" 
            className="border-3 border-dark rounded-3 mb-4"
            style={{
              backgroundColor: '#87CEEB',
              color: '#000000',
              fontWeight: '600'
            }}
          >
            <Row className="text-start">
              <Col md={6}>
                <strong>📦 Número de Orden:</strong><br />
                <span className="fs-5 fw-bold">{orderNumber}</span>
              </Col>
              <Col md={6}>
                <strong>💰 Total Pagado:</strong><br />
                <span className="fs-5 fw-bold">${typeof total === 'number' ? total.toLocaleString('es-CL') : '0'}</span>
              </Col>
            </Row>
            {transactionId && (
              <Row className="mt-2">
                <Col>
                  <strong>🔒 ID de Transacción:</strong><br />
                  <span className="small">{transactionId}</span>
                </Col>
              </Row>
            )}
          </Alert>

          <div 
            className="p-3 rounded-3 border-3 border-dark mb-4"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000'
            }}
          >
            <h6 className="fw-bold mb-2">📋 Próximos pasos:</h6>
            <ul className="list-unstyled small mb-0">
              <li>✅ Recibirás un correo de confirmación</li>
              <li>📦 Tu pedido será preparado para el envío</li>
              <li>🚚 Te notificaremos cuando sea despachado</li>
              <li>⏱️ Tiempo estimado de entrega: 3-5 días hábiles</li>
            </ul>
          </div>

          <div 
            className="small p-2 rounded-3 border-2 border-dark"
            style={{
              backgroundColor: '#87CEEB',
              color: '#000000'
            }}
          >
            <strong>📞 ¿Necesitas ayuda?</strong> Contáctanos en soporte@junimostore.cl
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer
        className="border-3 border-success"
        style={{
          backgroundColor: '#90EE90',
        }}
      >
        <Button 
          as={Link}
          to="/pedidos"
          variant="primary" 
          className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
          style={{
            backgroundColor: '#87CEEB',
            color: '#000000',
            minWidth: '140px'
          }}
        >
          👀 Ver Mis Pedidos
        </Button>
        <Button 
          as={Link}
          to="/index"
          variant="success" 
          className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
          style={{
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            color: '#FFFFFF',
            minWidth: '140px',
            border: 'none'
          }}
        >
          🏠 Volver al Inicio
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentSuccessModal;