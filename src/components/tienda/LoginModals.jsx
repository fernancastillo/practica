import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const SuccessModal = ({ show, onHide, user, userType }) => {
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
        <Modal.Title className="fw-bold text-center w-100" style={{ color: '#000000' }}>
          <span style={{ fontFamily: "'Indie Flower', cursive", fontSize: '1.8rem' }}>
            ✅ ¡Inicio de Sesión Exitoso!
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="text-center py-4"
        style={{
          backgroundColor: '#87CEEB',
        }}
      >
        <div className="mb-4">
          <div 
            className="display-1 mb-3"
            style={{ color: '#000000' }}
          >
            🎉
          </div>
          <h4 
            className="fw-bold mb-3"
            style={{ 
              color: '#000000',
              fontFamily: "'Indie Flower', cursive"
            }}
          >
            ¡Bienvenido de vuelta, {user?.nombre}!
          </h4>
          <p 
            className="fs-5"
            style={{ 
              color: '#000000',
              fontWeight: '500'
            }}
          >
            Has iniciado sesión correctamente.
          </p>
          <p 
            className="fs-6"
            style={{ 
              color: '#000000',
              fontWeight: '400'
            }}
          >
            {userType === 'Administrador' || userType === 'Admin'
              ? 'Serás redirigido al panel de administración.' 
              : 'Serás redirigido a la página principal.'}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer
        className="border-3 border-dark justify-content-center"
        style={{
          backgroundColor: '#87CEEB',
        }}
      >
        <Button 
          onClick={onHide}
          className="rounded-pill px-5 py-2 border-3 border-dark fw-bold"
          style={{
            backgroundColor: '#dedd8ff5',
            color: '#000000',
            transition: 'all 0.3s ease',
            fontFamily: "'Lato', sans-serif",
            fontSize: '1.1rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(222, 221, 143, 0.6)';
            e.target.style.backgroundColor = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
            e.target.style.backgroundColor = '#dedd8ff5';
          }}
        >
          Continuar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ErrorModal = ({ show, onHide, error }) => {
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
        <Modal.Title className="fw-bold text-center w-100" style={{ color: '#000000' }}>
          <span style={{ fontFamily: "'Indie Flower', cursive", fontSize: '1.8rem' }}>
            ❌ Error al Iniciar Sesión
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="text-center py-4"
        style={{
          backgroundColor: '#87CEEB',
        }}
      >
        <div className="mb-4">
          <div 
            className="display-1 mb-3"
            style={{ color: '#000000' }}
          >
            😔
          </div>
          <h4 
            className="fw-bold mb-3"
            style={{ 
              color: '#000000',
              fontFamily: "'Indie Flower', cursive"
            }}
          >
            No se pudo iniciar sesión
          </h4>
          <p 
            className="fs-5"
            style={{ 
              color: '#000000',
              fontWeight: '500'
            }}
          >
            {error}
          </p>
          <p 
            className="fs-6"
            style={{ 
              color: '#000000',
              fontWeight: '400'
            }}
          >
            Por favor, verifica tus credenciales e intenta nuevamente.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer
        className="border-3 border-dark justify-content-center"
        style={{
          backgroundColor: '#87CEEB',
        }}
      >
        <Button 
          onClick={onHide}
          className="rounded-pill px-5 py-2 border-3 border-dark fw-bold"
          style={{
            backgroundColor: '#dedd8ff5',
            color: '#000000',
            transition: 'all 0.3s ease',
            fontFamily: "'Lato', sans-serif",
            fontSize: '1.1rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(222, 221, 143, 0.6)';
            e.target.style.backgroundColor = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
            e.target.style.backgroundColor = '#dedd8ff5';
          }}
        >
          Intentar Nuevamente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};