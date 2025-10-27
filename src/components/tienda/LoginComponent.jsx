// src/components/tienda/login/LoginComponent.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../utils/tienda/authService';

// Importar la imagen del login
import loginImage from '../../assets/tienda/login.png';

const LoginComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loginResult, setLoginResult] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        setLoginResult({
          success: true,
          user: result.user,
          redirectTo: result.redirectTo
        });
        setShowSuccessModal(true);
      } else {
        setLoginResult({
          success: false,
          error: result.error
        });
        setShowErrorModal(true);
      }
    } catch (err) {
      setLoginResult({
        success: false,
        error: 'Error al iniciar sesión'
      });
      setShowErrorModal(true);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    navigate(loginResult.redirectTo || '/index');
  };

  const handleErrorContinue = () => {
    setShowErrorModal(false);
    // Limpiar contraseña al continuar después de error
    setFormData(prev => ({ ...prev, password: '' }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="min-vh-100 w-100 py-5"
      style={{
        backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      {/* Espacio para el navbar fixed */}
      <div style={{ height: '80px' }}></div>

      <Container>
        {/* Títulos fuera de la card - Con imagen */}
        <Row className="justify-content-center mb-4">
          <Col md={8} lg={6}>
            <div className="text-center">
              {/* Imagen del login en lugar del texto */}
              <div className="mb-3">
                <img
                  src={loginImage}
                  alt="Iniciar Sesión - Junimo Store"
                  className="img-fluid"
                  style={{
                    maxWidth: '400px',
                    width: '100%',
                    filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.8))'
                  }}
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    e.target.style.display = 'none';
                    // Mostrar texto alternativo
                    const fallbackElement = document.getElementById('fallback-title');
                    if (fallbackElement) {
                      fallbackElement.style.display = 'block';
                    }
                  }}
                />
              </div>
              
              {/* Texto alternativo que se muestra si la imagen no carga */}
              <h2 
                id="fallback-title"
                className="fw-bold mb-3"
                style={{
                  fontFamily: "'Indie Flower', cursive",
                  color: '#000000',
                  fontSize: '2.5rem',
                  textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
                  display: 'none' /* Oculto por defecto */
                }}
              >
                Iniciar Sesión
              </h2>
              
              <p 
                className="fs-5"
                style={{
                  color: '#000000',
                  fontWeight: '500',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.7)'
                }}
              >
                Ingresa a tu cuenta de Junimo Store
              </p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
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

                <Form onSubmit={handleSubmit}>
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
                      onChange={handleChange}
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
                        onChange={handleChange}
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
                        onClick={togglePasswordVisibility}
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
                    variant="primary" 
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
          </Col>
        </Row>
      </Container>

      {/* Modal de éxito */}
      <Modal
        show={showSuccessModal}
        onHide={handleSuccessContinue}
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
              ¡Bienvenido de vuelta, {loginResult.user?.nombre}!
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
              {loginResult.user?.type === 'Administrador' 
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
            variant="primary" 
            onClick={handleSuccessContinue}
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

      {/* Modal de error */}
      <Modal
        show={showErrorModal}
        onHide={handleErrorContinue}
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
              {loginResult.error}
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
            variant="primary" 
            onClick={handleErrorContinue}
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
    </div>
  );
};

export default LoginComponent;