import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../utils/tienda/authService';
import polloPerfil from '../../assets/tienda/polloperfil.png';
import './PerfilUsuario.css';

const PerfilUsuario = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        console.log('Usuario actual:', currentUser);
        
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        setUser(currentUser);
        setFormData({
          nombre: currentUser.nombre || '',
          apellido: currentUser.apellido || '',
          email: currentUser.email || '',
          telefono: currentUser.telefono || ''
        });
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log('Datos a actualizar:', formData);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  if (loading) {
    return (
      <div className="perfil-page">
        <div className="navbar-spacer"></div>
        <Container className="py-5 text-center">
          <div className="loading-perfil">
            <span className="loading-icon">🌾</span>
            <h4 className="text-white mt-3">Cargando perfil...</h4>
          </div>
        </Container>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="perfil-page">
        <div className="navbar-spacer"></div>
        <Container className="py-5 text-center">
          <div className="no-user">
            <span className="no-user-icon">🔒</span>
            <h4 className="text-white mt-3">No has iniciado sesión</h4>
            <p className="text-white">Por favor inicia sesión para acceder a tu perfil</p>
            <Button 
              variant="warning" 
              onClick={() => navigate('/login')}
              className="mt-3"
            >
              Iniciar Sesión
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <div className="navbar-spacer"></div>
      
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="page-title">
              <img src={polloPerfil} alt="Perfil" style={{width: '50px', height: '50px', marginRight: '15px'}} />
              Mi Perfil
            </h1>
            <p className="page-subtitle">
              Gestiona tu información personal y preferencias
            </p>
          </Col>
        </Row>

        {showAlert && (
          <Alert variant="success" className="mb-4">
            ✅ Perfil actualizado correctamente
          </Alert>
        )}

        <Tabs defaultActiveKey="perfil" className="mb-4 profile-tabs">
          <Tab eventKey="perfil" title="📝 Información Personal">
            <Card className="profile-card">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={formData.nombre || ''}
                          onChange={handleInputChange}
                          required
                          className="profile-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                          type="text"
                          name="apellido"
                          value={formData.apellido || ''}
                          onChange={handleInputChange}
                          required
                          className="profile-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      required
                      className="profile-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={formData.telefono || ''}
                      onChange={handleInputChange}
                      className="profile-input"
                      placeholder="+56 9 1234 5678"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="save-btn">
                    💾 Guardar Cambios
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="seguridad" title="🔒 Seguridad">
            <Card className="profile-card">
              <Card.Body>
                <h5 className="section-title">Cambiar Contraseña</h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña Actual</Form.Label>
                    <Form.Control 
                      type="password" 
                      className="profile-input"
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nueva Contraseña</Form.Label>
                    <Form.Control 
                      type="password" 
                      className="profile-input"
                      placeholder="Ingresa tu nueva contraseña"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                    <Form.Control 
                      type="password" 
                      className="profile-input"
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </Form.Group>
                  <Button variant="warning" className="save-btn">
                    🔑 Actualizar Contraseña
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="preferencias" title="⚙️ Preferencias">
            <Card className="profile-card">
              <Card.Body>
                <h5 className="section-title">Configuración de Notificaciones</h5>
                <Form>
                  <div className="preference-item">
                    <Form.Check
                      type="switch"
                      id="email-notifications"
                      label="Recibir notificaciones por email"
                      defaultChecked
                      className="preference-switch"
                    />
                  </div>
                  <div className="preference-item">
                    <Form.Check
                      type="switch"
                      id="promo-notifications"
                      label="Recibir promociones y ofertas"
                      defaultChecked
                      className="preference-switch"
                    />
                  </div>
                  <div className="preference-item">
                    <Form.Check
                      type="switch"
                      id="order-updates"
                      label="Actualizaciones de pedidos"
                      defaultChecked
                      className="preference-switch"
                    />
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default PerfilUsuario;