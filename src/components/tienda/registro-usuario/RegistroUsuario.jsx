import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, InputGroup, Modal } from 'react-bootstrap';
import { registroService } from '../../../utils/tienda/registroService';
import { registroValidaciones } from '../../../utils/tienda/registroValidaciones';
import regionesComunasData from '../../../data/regiones_comunas.json';

// Importar la imagen del registro
import registroImage from '../../../assets/tienda/registro.png';

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
    region: '', // ID de la región
    regionNombre: '', // Nombre de la región
    comuna: '',
    
    // Seguridad
    password: '',
    confirmarPassword: '',
  });

  const [errores, setErrores] = useState({});
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState('');
  const [comunasFiltradas, setComunasFiltradas] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Refs para los campos del formulario
  const runRef = useRef(null);
  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const emailRef = useRef(null);
  const fonoRef = useRef(null);
  const fechaNacimientoRef = useRef(null);
  const direccionRef = useRef(null);
  const regionRef = useRef(null);
  const comunaRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmarPasswordRef = useRef(null);

  // Cargar regiones desde el JSON
  useEffect(() => {
    setRegiones(regionesComunasData.regiones || []);
  }, []);

  // Filtrar comunas cuando cambia la región
  useEffect(() => {
    if (formData.region) {
      const regionSeleccionada = regiones.find(r => r.id === parseInt(formData.region));
      const comunas = regionSeleccionada ? regionSeleccionada.comunas : [];
      setComunasFiltradas(comunas);
      
      // Resetear comuna si la región cambia
      if (formData.comuna && !comunas.includes(formData.comuna)) {
        setFormData(prev => ({ ...prev, comuna: '' }));
      }
    } else {
      setComunasFiltradas([]);
      setFormData(prev => ({ ...prev, comuna: '' }));
    }
  }, [formData.region, regiones, formData.comuna]);

  // Función para hacer scroll al primer campo con error
  const scrollToFirstError = () => {
    const errorFields = Object.keys(errores);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const refs = {
        run: runRef,
        nombre: nombreRef,
        apellido: apellidoRef,
        email: emailRef,
        fono: fonoRef,
        fechaNacimiento: fechaNacimientoRef,
        direccion: direccionRef,
        region: regionRef,
        comuna: comunaRef,
        password: passwordRef,
        confirmarPassword: confirmarPasswordRef
      };

      if (refs[firstErrorField] && refs[firstErrorField].current) {
        // Scroll suave al campo con error
        refs[firstErrorField].current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Enfocar el campo
        setTimeout(() => {
          refs[firstErrorField].current.focus();
        }, 500);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Limpiar caracteres no numéricos para RUN y teléfono
    let processedValue = value;
    if (name === 'run') {
      processedValue = value.replace(/[^0-9]/g, ''); // Solo números
    } else if (name === 'fono') {
      processedValue = value.replace(/[^0-9]/g, ''); // Solo números
    }
    
    // Si es el campo de región, también guardar el nombre
    if (name === 'region') {
      const regionSeleccionada = regiones.find(r => r.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        region: value,
        regionNombre: regionSeleccionada ? regionSeleccionada.nombre : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    }

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
    
    // Si hay errores, hacer scroll al primero
    if (!validacion.esValido) {
      setTimeout(() => {
        scrollToFirstError();
      }, 100);
    }
    
    return validacion.esValido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Iniciando validación del formulario...');
    
    if (validarFormulario()) {
      console.log('✅ Formulario válido, procediendo con registro...');
      console.log('📦 Datos del formulario:', formData);
      
      const resultado = registroService.registrarUsuario(formData);
      
      console.log('🔍 Resultado del registro:', resultado);
      
      if (resultado.success) {
        setRegistroExitoso(true);
        setMensajeAlerta(resultado.message);
        setMostrarAlerta(true);
        setShowSuccessModal(true);
        
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
          regionNombre: '',
          comuna: '',
          password: '',
          confirmarPassword: '',
        });
        
      } else {
        console.log('❌ Error en registro:', resultado.error);
        setMensajeAlerta(resultado.error);
        setRegistroExitoso(false);
        setMostrarAlerta(true);
        
        // Hacer scroll al principio del formulario si hay error general
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    } else {
      console.log('❌ Formulario inválido, errores:', errores);
      setMostrarAlerta(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    // Redirigir al login después de cerrar el modal
    window.location.href = '/login';
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Componente para etiquetas con asterisco rojo
  const FormLabelWithAsterisk = ({ children, required = false }) => (
    <Form.Label className="fw-semibold" style={{ color: '#000000' }}>
      {children} {required && <span style={{ color: 'red' }}>*</span>}
    </Form.Label>
  );

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
      <Container>
        {/* Títulos fuera de la card - Ahora con imagen */}
        <Row className="justify-content-center mb-4">
          <Col md={10} lg={8}>
            <div className="text-center">
              {/* Imagen del registro en lugar del texto */}
              <div className="mb-3">
                <img
                  src={registroImage}
                  alt="Crear Cuenta - Junimo Store"
                  className="img-fluid"
                  style={{
                    maxWidth: '900px',
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
                Crear Cuenta
              </h2>
              
              <p 
                className="fs-5"
                style={{
                  color: '#FFFFFF',
                  fontWeight: '500',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
                }}
              >
                Únete a la comunidad de Junimo Store
              </p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card 
              className="shadow-lg border-3 border-dark rounded-4"
              style={{
                backgroundColor: '#87CEEB',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Card.Body className="p-4 p-md-5">
                {mostrarAlerta && !registroExitoso && (
                  <Alert 
                    variant="danger"
                    className="text-center border-3 border-dark rounded-3"
                    style={{
                      backgroundColor: '#FFB6C1',
                      color: '#000000',
                      fontWeight: '600'
                    }}
                  >
                    {mensajeAlerta}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* SECCIÓN DATOS PERSONALES */}
                  <h5 
                    className="mb-3 fw-bold"
                    style={{
                      color: '#000000',
                      fontFamily: "'Indie Flower', cursive",
                      fontSize: '1.5rem'
                    }}
                  >
                    Datos Personales
                  </h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={runRef}>
                        <FormLabelWithAsterisk required>RUN</FormLabelWithAsterisk>
                        <Form.Control
                          type="text"
                          name="run"
                          value={formData.run}
                          onChange={handleChange}
                          isInvalid={!!errores.run}
                          placeholder="123456789 (sin puntos ni guion)"
                          className="border-3 border-dark rounded-3"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                          maxLength={9}
                        />
                        <Form.Text className="text-muted" style={{ fontFamily: "'Lato', sans-serif" }}>
                          8-9 dígitos sin puntos ni guion
                        </Form.Text>
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.run}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={fonoRef}>
                        <FormLabelWithAsterisk>Teléfono</FormLabelWithAsterisk>
                        <Form.Control
                          type="tel"
                          name="fono"
                          value={formData.fono}
                          onChange={handleChange}
                          isInvalid={!!errores.fono}
                          placeholder="912345678"
                          className="border-3 border-dark rounded-3"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                          maxLength={9}
                        />
                        <Form.Text className="text-muted" style={{ fontFamily: "'Lato', sans-serif" }}>
                          9 dígitos, comenzando con 9 (opcional)
                        </Form.Text>
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.fono}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={nombreRef}>
                        <FormLabelWithAsterisk required>Nombre</FormLabelWithAsterisk>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          isInvalid={!!errores.nombre}
                          placeholder="Ingresa tu nombre"
                          className="border-3 border-dark rounded-3"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.nombre}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={apellidoRef}>
                        <FormLabelWithAsterisk required>Apellido</FormLabelWithAsterisk>
                        <Form.Control
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          isInvalid={!!errores.apellido}
                          placeholder="Ingresa tu apellido"
                          className="border-3 border-dark rounded-3"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.apellido}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={emailRef}>
                        <FormLabelWithAsterisk required>Email</FormLabelWithAsterisk>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errores.email}
                          placeholder="ejemplo@correo.com"
                          className="border-3 border-dark rounded-3"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                        />
                        <Form.Text 
                          className="fw-semibold"
                          style={{ 
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                        >
                          {formData.email && (formData.email.endsWith('@duoc.cl') || formData.email.endsWith('@duocuc.cl')) 
                            ? '🎓 Obtendrás un 20% de descuento en tus compras si tu correo pertenece a DUOC' 
                            : 'Usa tu email @duoc.cl para obtener 20% de descuento'}
                        </Form.Text>
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={fechaNacimientoRef}>
                        <FormLabelWithAsterisk required>Fecha de Nacimiento</FormLabelWithAsterisk>
                        <Form.Control
                          type="date"
                          name="fechaNacimiento"
                          value={formData.fechaNacimiento}
                          onChange={handleChange}
                          isInvalid={!!errores.fechaNacimiento}
                          className="border-3 border-dark rounded-3"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.fechaNacimiento}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* SECCIÓN DIRECCIÓN */}
                  <h5 
                    className="mb-3 fw-bold mt-4"
                    style={{
                      color: '#000000',
                      fontFamily: "'Indie Flower', cursive",
                      fontSize: '1.5rem'
                    }}
                  >
                    Dirección
                  </h5>
                  
                  <Form.Group className="mb-3" ref={direccionRef}>
                    <FormLabelWithAsterisk required>Dirección</FormLabelWithAsterisk>
                    <Form.Control
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      isInvalid={!!errores.direccion}
                      placeholder="Calle, número, departamento"
                      className="border-3 border-dark rounded-3"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        fontFamily: "'Lato', sans-serif"
                      }}
                    />
                    <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                      {errores.direccion}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={regionRef}>
                        <FormLabelWithAsterisk required>Región</FormLabelWithAsterisk>
                        <Form.Select
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          isInvalid={!!errores.region}
                          className="border-3 border-dark rounded-3"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                        >
                          <option value="">Selecciona una región</option>
                          {regiones.map(region => (
                            <option key={region.id} value={region.id}>
                              {region.nombre}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.region}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={comunaRef}>
                        <FormLabelWithAsterisk required>Comuna</FormLabelWithAsterisk>
                        <Form.Select
                          name="comuna"
                          value={formData.comuna}
                          onChange={handleChange}
                          isInvalid={!!errores.comuna}
                          disabled={!formData.region}
                          className="border-3 border-dark rounded-3"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            fontFamily: "'Lato', sans-serif"
                          }}
                        >
                          <option value="">{formData.region ? 'Selecciona una comuna' : 'Primero selecciona una región'}</option>
                          {comunasFiltradas.map(comuna => (
                            <option key={comuna} value={comuna}>
                              {comuna}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.comuna}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* SECCIÓN CONTRASEÑA */}
                  <h5 
                    className="mb-3 fw-bold mt-4"
                    style={{
                      color: '#000000',
                      fontFamily: "'Indie Flower', cursive",
                      fontSize: '1.5rem'
                    }}
                  >
                    Seguridad
                  </h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={passwordRef}>
                        <FormLabelWithAsterisk required>Contraseña</FormLabelWithAsterisk>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errores.password}
                            placeholder="Entre 4 y 10 caracteres"
                            className="border-3 border-dark rounded-3"
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              fontFamily: "'Lato', sans-serif"
                            }}
                          />
                          <Button
                            variant="outline-dark"
                            className="border-3 border-dark"
                            onClick={togglePasswordVisibility}
                            style={{
                              backgroundColor: '#dedd8ff5',
                              color: '#000000'
                            }}
                          >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                          </Button>
                        </InputGroup>
                        <Form.Text className="text-muted" style={{ fontFamily: "'Lato', sans-serif" }}>
                          La contraseña debe tener entre 4 y 10 caracteres
                        </Form.Text>
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" ref={confirmarPasswordRef}>
                        <FormLabelWithAsterisk required>Confirmar Contraseña</FormLabelWithAsterisk>
                        <InputGroup>
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmarPassword"
                            value={formData.confirmarPassword}
                            onChange={handleChange}
                            isInvalid={!!errores.confirmarPassword}
                            placeholder="Repite tu contraseña"
                            className="border-3 border-dark rounded-3"
                            style={{
                              backgroundColor: '#FFFFFF',
                              color: '#000000',
                              fontFamily: "'Lato', sans-serif"
                            }}
                          />
                          <Button
                            variant="outline-dark"
                            className="border-3 border-dark"
                            onClick={toggleConfirmPasswordVisibility}
                            style={{
                              backgroundColor: '#dedd8ff5',
                              color: '#000000'
                            }}
                          >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                          </Button>
                        </InputGroup>
                        <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
                          {errores.confirmarPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 rounded-pill py-3 border-3 border-dark fw-bold mt-4"
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
                    Crear Cuenta
                  </Button>

                  {/* Mensaje de campos obligatorios */}
                  <div className="text-center mt-3">
                    <p 
                      style={{ 
                        color: '#000000',
                        fontFamily: "'Lato', sans-serif",
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span style={{ color: 'red' }}>*</span> Campos obligatorios
                    </p>
                  </div>

                  <div className="text-center mt-3">
                    <p 
                      style={{ 
                        color: '#000000',
                        fontFamily: "'Lato', sans-serif",
                        fontWeight: '500'
                      }}
                    >
                      ¿Ya tienes cuenta? <a href="/login" style={{ color: '#000000', fontWeight: 'bold', textDecoration: 'underline' }}>Inicia sesión aquí</a>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal de éxito */}
      <Modal
        show={showSuccessModal}
        onHide={handleContinue}
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
              ✅ ¡Registro Exitoso!
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
              ¡Bienvenido a Junimo Store!
            </h4>
            <p 
              className="fs-5"
              style={{ 
                color: '#000000',
                fontWeight: '500'
              }}
            >
              Tu cuenta ha sido creada exitosamente.
            </p>
            <p 
              className="fs-6"
              style={{ 
                color: '#000000',
                fontWeight: '400'
              }}
            >
              Ahora puedes iniciar sesión y comenzar a disfrutar de nuestros productos.
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
            onClick={handleContinue}
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
            Continuar al Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegistroUsuario;