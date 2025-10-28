// src/components/tienda/payment/CreditCardModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { paymentService } from '../../utils/tienda/paymentService';

const CreditCardModal = ({ 
  show, 
  onHide, 
  onPaymentSuccess, 
  totalFinal,
  discountCode = '' 
}) => {
  const [creditCardData, setCreditCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    // Aplicar formato según el campo
    if (field === 'cardNumber') {
      formattedValue = paymentService.formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = paymentService.formatExpiryDate(value);
    } else if (field === 'cvv') {
      // Solo números, máximo 4 caracteres
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'cardName') {
      // Solo letras y espacios
      formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }
    
    setCreditCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    if (paymentError) {
      setPaymentError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = paymentService.validateCreditCard(creditCardData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Procesar pago (siempre exitoso)
      const paymentResult = await paymentService.processPayment(creditCardData, totalFinal);
      
      if (paymentResult.success) {
        // Éxito - llamar al callback con los datos del pago
        onPaymentSuccess({
          ...creditCardData,
          transactionId: paymentResult.transactionId,
          total: totalFinal,
          discountCode: discountCode,
          timestamp: paymentResult.timestamp
        });
      } else {
        // Esto no debería ocurrir, pero por si acaso
        setPaymentError(paymentResult.error || 'Error inesperado en el pago');
      }
    } catch (error) {
      setPaymentError('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const detectCardIcon = () => {
    const cardType = paymentService.detectCardType(creditCardData.cardNumber);
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      diners: '💳',
      discover: '💳',
      unknown: '💳'
    };
    return icons[cardType];
  };

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
            🏦 Datos de Tarjeta de Crédito
          </span>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body
        style={{
          backgroundColor: '#87CEEB',
        }}
      >
        {paymentError && (
          <Alert 
            variant="danger" 
            className="border-3 border-dark rounded-3"
            style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              fontWeight: '600'
            }}
          >
            ❌ {paymentError}
          </Alert>
        )}

        <div 
          className="p-3 rounded-3 border-3 border-dark mb-4 text-center"
          style={{
            backgroundColor: '#90EE90',
            color: '#000000'
          }}
        >
          <h5 className="fw-bold mb-1">Total a Pagar</h5>
          <div className="fs-3 fw-bold">${totalFinal.toLocaleString('es-CL')}</div>
          {discountCode && (
            <div className="small">
              Código de descuento: <strong>{discountCode}</strong>
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>
                  {detectCardIcon()} Número de Tarjeta
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={creditCardData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className={`border-3 border-dark fw-bold ${errors.cardNumber ? 'border-danger' : ''}`}
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  maxLength={19}
                  disabled={isProcessing}
                />
                {errors.cardNumber && (
                  <div className="text-danger small mt-1 fw-bold">{errors.cardNumber}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>
                  👤 Nombre en la Tarjeta
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="JUAN PEREZ GARCIA"
                  value={creditCardData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                  className={`border-3 border-dark fw-bold ${errors.cardName ? 'border-danger' : ''}`}
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  disabled={isProcessing}
                />
                {errors.cardName && (
                  <div className="text-danger small mt-1 fw-bold">{errors.cardName}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>
                  📅 Fecha de Expiración (MM/YY)
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="12/25"
                  value={creditCardData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className={`border-3 border-dark fw-bold ${errors.expiryDate ? 'border-danger' : ''}`}
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  maxLength={5}
                  disabled={isProcessing}
                />
                {errors.expiryDate && (
                  <div className="text-danger small mt-1 fw-bold">{errors.expiryDate}</div>
                )}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>
                  🔒 CVV
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="123"
                  value={creditCardData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className={`border-3 border-dark fw-bold ${errors.cvv ? 'border-danger' : ''}`}
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  maxLength={4}
                  disabled={isProcessing}
                />
                {errors.cvv && (
                  <div className="text-danger small mt-1 fw-bold">{errors.cvv}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: '#000000' }}>
                  💰 Cuotas
                </Form.Label>
                <Form.Select
                  value={creditCardData.installments}
                  onChange={(e) => handleInputChange('installments', e.target.value)}
                  className="border-3 border-dark fw-bold"
                  style={{ 
                    color: '#000000',
                    backgroundColor: '#FFFFFF'
                  }}
                  disabled={isProcessing}
                >
                  <option value="1">1 cuota (${totalFinal.toLocaleString('es-CL')})</option>
                  <option value="3">3 cuotas (${Math.ceil(totalFinal / 3).toLocaleString('es-CL')} c/u)</option>
                  <option value="6">6 cuotas (${Math.ceil(totalFinal / 6).toLocaleString('es-CL')} c/u)</option>
                  <option value="12">12 cuotas (${Math.ceil(totalFinal / 12).toLocaleString('es-CL')} c/u)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div 
            className="p-2 rounded-3 border-2 border-dark small text-center"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000'
            }}
          >
            🔒 Tus datos están protegidos con encriptación SSL. No almacenamos información de tu tarjeta.
          </div>
        </Form>
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
          disabled={isProcessing}
        >
          Cancelar
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit}
          className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
          style={{
            background: 'linear-gradient(135deg, #28a745, #20c997)',
            color: '#FFFFFF',
            minWidth: '120px',
            border: 'none'
          }}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Procesando...
            </>
          ) : (
            `Pagar $${totalFinal.toLocaleString('es-CL')}`
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreditCardModal;