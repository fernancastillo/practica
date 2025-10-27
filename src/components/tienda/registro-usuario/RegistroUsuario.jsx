import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { registroService } from '../../../utils/tienda/registroService';
import { registroValidaciones } from '../../../utils/tienda/registroValidaciones';
import { regionesYComunas } from '../../../utils/tienda/comunasRegiones';
import './RegistroUsuario.css';

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    // Datos personales
    run: '',
    nombre: '',
    apellido: '',
    email: '',
    fono: '',
    fechaNacimiento: '',
    
    // Dirección
    direccion: '',
    region: '',
    comuna: '',
    
    // Seguridad
    password: '',
    confirmarPassword: '',
    aceptoTerminos: false
  });

  const [errores, setErrores] = useState({});
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState('');
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

  // Filtrar comunas cuando cambia la región
  useEffect(() => {
    if (formData.region) {
      const comunas = regionesYComunas.comunas[formData.region] || [];
      setComunasFiltradas(comunas);
      
      // Resetear comuna si la región cambia
      if (!comunas.includes(formData.comuna)) {
        setFormData(prev => ({ ...prev, comuna: '' }));
      }
    } else {
      setComunasFiltradas([]);
      setFormData(prev => ({ ...prev, comuna: '' }));
    }
  }, [formData.region]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const validacion = registroValidaciones.validarFormularioCompleto(formData);
    setErrores(validacion.errores);
    return validacion.esValido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      const resultado = registroService.registrarUsuario(formData);
      
      if (resultado.success) {
        setRegistroExitoso(true);
        setMensajeAlerta(resultado.message);
        setMostrarAlerta(true);
        
        // Limpiar formulario
        setFormData({
          run: '',
          nombre: '',
          apellido: '',
          email: '',
          fono: '',
          fechaNacimiento: '',
          direccion: '',
          region: '',
          comuna: '',
          password: '',
          confirmarPassword: '',
          aceptoTerminos: false
        });
        
        setTimeout(() => {
          setMostrarAlerta(false);
          // Redirigir al login después de registro exitoso
          window.location.href = '/login';
        }, 3000);
      } else {
        setMensajeAlerta(resultado.error);
        setRegistroExitoso(false);
        setMostrarAlerta(true);
      }
    } else {
      setMostrarAlerta(false);
    }
  };

  return (
    <Container className="registro-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="registro-card shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="registro-titulo">Crear Cuenta</h2>
                <p className="registro-subtitulo">Únete a la comunidad de Junimo Store</p>
              </div>

              {mostrarAlerta && (
                <Alert variant={registroExitoso ? "success" : "danger"} className="text-center">
                  {mensajeAlerta}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* SECCIÓN DATOS PERSONALES */}
                <h5 className="mb-3 text-primary">Datos Personales</h5>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>RUN *</Form.Label>
                      <Form.Control
                        type="text"
                        name="run"
                        value={formData.run}
                        onChange={handleChange}
                        isInvalid={!!errores.run}
                        placeholder="12345678-9"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.run}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="fono"
                        value={formData.fono}
                        onChange={handleChange}
                        isInvalid={!!errores.fono}
                        placeholder="+56 9 1234 5678"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.fono}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        isInvalid={!!errores.nombre}
                        placeholder="Ingresa tu nombre"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido *</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        isInvalid={!!errores.apellido}
                        placeholder="Ingresa tu apellido"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.apellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errores.email}
                        placeholder="ejemplo@correo.com"
                      />
                      <Form.Text className="text-muted">
                        {formData.email && (formData.email.endsWith('@duoc.cl') || formData.email.endsWith('@duocuc.cl')) 
                          ? '🎓 ¡Obtendrás 15% de descuento por ser estudiante Duoc!' 
                          : 'Usa tu email @duoc.cl para obtener 15% de descuento'}
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errores.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Nacimiento *</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        isInvalid={!!errores.fechaNacimiento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.fechaNacimiento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* SECCIÓN DIRECCIÓN */}
                <h5 className="mb-3 text-primary mt-4">Dirección</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>Dirección *</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    isInvalid={!!errores.direccion}
                    placeholder="Calle, número, departamento"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.direccion}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Región *</Form.Label>
                      <Form.Select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        isInvalid={!!errores.region}
                      >
                        <option value="">Selecciona una región</option>
                        {regionesYComunas.regiones.map(region => (
                          <option key={region.id} value={region.id}>
                            {region.nombre}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errores.region}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Comuna *</Form.Label>
                      <Form.Select
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleChange}
                        isInvalid={!!errores.comuna}
                        disabled={!formData.region}
                      >
                        <option value="">Selecciona una comuna</option>
                        {comunasFiltradas.map(comuna => (
                          <option key={comuna} value={comuna}>
                            {comuna}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errores.comuna}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* SECCIÓN CONTRASEÑA */}
                <h5 className="mb-3 text-primary mt-4">Seguridad</h5>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errores.password}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Contraseña *</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmarPassword"
                        value={formData.confirmarPassword}
                        onChange={handleChange}
                        isInvalid={!!errores.confirmarPassword}
                        placeholder="Repite tu contraseña"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.confirmarPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* TÉRMINOS Y CONDICIONES */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="aceptoTerminos"
                    checked={formData.aceptoTerminos}
                    onChange={handleChange}
                    isInvalid={!!errores.aceptoTerminos}
                    label={
                      <span>
                        Acepto los <a href="/terminos" className="terminos-link">términos y condiciones</a> y la <a href="/privacidad" className="terminos-link">política de privacidad</a>
                      </span>
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.aceptoTerminos}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 registro-btn"
                  size="lg"
                >
                  Crear Cuenta
                </Button>

                <div className="text-center mt-3">
                  <p className="login-link">
                    ¿Ya tienes cuenta? <a href="/login" className="login-link-text">Inicia sesión aquí</a>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistroUsuario;