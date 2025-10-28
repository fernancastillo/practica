import React from 'react';
import { Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginForm = ({ 
  formData, 
  loading, 
  error, 
  showPassword, 
  onInputChange, 
  onSubmit, 
  onTogglePassword 
}) => {
  return (
    <Card 
      className="shadow-lg border-3 border-dark rounded-4"
      style={{
        backgroundColor: '#87CEEB',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Card.Body className="p-4 p-md-5">
        {error && (
          <Alert 
            variant="danger"
            className="text-center border-3 border-dark rounded-3"
            style={{
              backgroundColor: '#FFB6C1',
              color: '#000000',
              fontWeight: '600'
            }}
          >
            {error}
          </Alert>
        )}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-4">
            <Form.Label 
              className="fw-semibold" 
              style={{ color: '#000000', fontSize: '1.1rem' }}
            >
              Correo Electrónico
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              disabled={loading}
              placeholder="tu@email.com"
              className="border-3 border-dark rounded-3 py-3"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontFamily: "'Lato', sans-serif",
                fontSize: '1rem'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label 
              className="fw-semibold" 
              style={{ color: '#000000', fontSize: '1.1rem' }}
            >
              Contraseña
            </Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={onInputChange}
                required
                disabled={loading}
                placeholder="Tu contraseña"
                className="border-3 border-dark rounded-3 py-3"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '1rem'
                }}
              />
              <Button
                variant="outline-dark"
                className="border-3 border-dark"
                onClick={onTogglePassword}
                disabled={loading}
                style={{
                  backgroundColor: '#dedd8ff5',
                  color: '#000000',
                  minWidth: '60px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button 
            type="submit" 
            className="w-100 rounded-pill py-3 border-3 border-dark fw-bold mb-4"
            disabled={loading}
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000',
              transition: 'all 0.3s ease',
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(222, 221, 143, 0.6)';
                e.target.style.backgroundColor = '#FFD700';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#dedd8ff5';
            }}
          >
            {loading ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm me-2" 
                  role="status" 
                  aria-hidden="true"
                  style={{ color: '#000000' }}
                ></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </Form>

        <hr 
          className="my-4" 
          style={{ 
            borderColor: '#000000', 
            opacity: '0.6', 
            borderWidth: '2px' 
          }} 
        />

        <div className="text-center">
          <p 
            className="mb-3"
            style={{ 
              color: '#000000',
              fontFamily: "'Lato', sans-serif",
              fontWeight: '500',
              fontSize: '1.1rem'
            }}
          >
            ¿No tienes una cuenta?
          </p>
          <Button 
            as={Link}
            to="/registro"
            variant="outline-dark"
            className="rounded-pill px-4 py-2 border-3 fw-bold"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000',
              transition: 'all 0.3s ease',
              fontFamily: "'Lato', sans-serif"
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
            Crear Cuenta
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;