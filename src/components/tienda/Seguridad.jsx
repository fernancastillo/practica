import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const Seguridad = () => {
  const [formData, setFormData] = useState({
    contraseñaActual: '',
    nuevaContraseña: '',
    confirmarContraseña: ''
  });
  const [errores, setErrores] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  // Obtener usuario actual
  const obtenerUsuarioActual = () => {
    try {
      const usuarioAuth = JSON.parse(localStorage.getItem('auth_user'));
      const usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
      return usuarios.find(u => u.run === usuarioAuth?.run);
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar contraseña actual
  const validarContraseñaActual = (contraseña) => {
    const usuario = obtenerUsuarioActual();
    if (!usuario) {
      return 'No se pudo obtener la información del usuario';
    }
    
    if (!contraseña || contraseña.trim().length === 0) {
      return 'La contraseña actual es obligatoria';
    }
    
    if (contraseña !== usuario.contrasenha) {
      return 'La contraseña actual no es correcta';
    }
    
    return '';
  };

  // Validar nueva contraseña
  const validarNuevaContraseña = (contraseña) => {
    if (!contraseña || contraseña.trim().length === 0) {
      return 'La nueva contraseña es obligatoria';
    }
    
    if (contraseña.length < 4 || contraseña.length > 10) {
      return 'La contraseña debe tener entre 4 y 10 caracteres';
    }
    
    return '';
  };

  // Validar confirmación de contraseña
  const validarConfirmarContraseña = (confirmarContraseña, nuevaContraseña) => {
    if (!confirmarContraseña || confirmarContraseña.trim().length === 0) {
      return 'Debes confirmar la nueva contraseña';
    }
    
    if (confirmarContraseña !== nuevaContraseña) {
      return 'Las contraseñas no coinciden';
    }
    
    return '';
  };

  // Validar formulario completo
  const validarFormulario = () => {
    const nuevosErrores = {
      contraseñaActual: validarContraseñaActual(formData.contraseñaActual),
      nuevaContraseña: validarNuevaContraseña(formData.nuevaContraseña),
      confirmarContraseña: validarConfirmarContraseña(formData.confirmarContraseña, formData.nuevaContraseña)
    };

    setErrores(nuevosErrores);
    
    return Object.values(nuevosErrores).every(error => error === '');
  };

  // Actualizar contraseña en localStorage
  const actualizarContraseñaEnStorage = (nuevaContraseña) => {
    try {
      const usuarioAuth = JSON.parse(localStorage.getItem('auth_user'));
      const usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
      
      const usuarioIndex = usuarios.findIndex(u => u.run === usuarioAuth?.run);
      
      if (usuarioIndex === -1) {
        throw new Error('Usuario no encontrado');
      }
      
      // Actualizar contraseña en app_usuarios
      usuarios[usuarioIndex].contrasenha = nuevaContraseña;
      localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
      
      return true;
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validarFormulario()) {
      setAlertVariant('danger');
      setAlertMessage('Por favor corrige los errores del formulario');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }
    
    // Actualizar contraseña
    const exito = actualizarContraseñaEnStorage(formData.nuevaContraseña);
    
    if (exito) {
      setAlertVariant('success');
      setAlertMessage('✅ Contraseña actualizada correctamente');
      setShowAlert(true);
      
      // Limpiar formulario
      setFormData({
        contraseñaActual: '',
        nuevaContraseña: '',
        confirmarContraseña: ''
      });
      setErrores({});
      
      setTimeout(() => setShowAlert(false), 5000);
    } else {
      setAlertVariant('danger');
      setAlertMessage('❌ Error al actualizar la contraseña');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

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
        Cambiar Contraseña
      </h5>

      {showAlert && (
        <Alert 
          variant={alertVariant}
          className="mb-4 text-center border-3 border-dark rounded-4"
          style={{
            backgroundColor: alertVariant === 'success' ? '#87CEEB' : '#FFB6C1',
            color: '#000000',
            fontWeight: '600'
          }}
        >
          {alertMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold" style={{ color: '#000000', fontSize: '1.1rem' }}>
            Contraseña Actual <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control 
            type="password"
            name="contraseñaActual"
            value={formData.contraseñaActual}
            onChange={handleInputChange}
            isInvalid={!!errores.contraseñaActual}
            className="border-3 border-dark rounded-3 py-3"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontFamily: "'Lato', sans-serif"
            }}
            placeholder="Ingresa tu contraseña actual"
          />
          <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
            {errores.contraseñaActual}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold" style={{ color: '#000000', fontSize: '1.1rem' }}>
            Nueva Contraseña <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control 
            type="password"
            name="nuevaContraseña"
            value={formData.nuevaContraseña}
            onChange={handleInputChange}
            isInvalid={!!errores.nuevaContraseña}
            className="border-3 border-dark rounded-3 py-3"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontFamily: "'Lato', sans-serif"
            }}
            placeholder="Entre 4 y 10 caracteres"
          />
          <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
            {errores.nuevaContraseña}
          </Form.Control.Feedback>
          <Form.Text className="text-muted" style={{ fontFamily: "'Lato', sans-serif" }}>
            La contraseña debe tener entre 4 y 10 caracteres
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold" style={{ color: '#000000', fontSize: '1.1rem' }}>
            Confirmar Nueva Contraseña <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control 
            type="password"
            name="confirmarContraseña"
            value={formData.confirmarContraseña}
            onChange={handleInputChange}
            isInvalid={!!errores.confirmarContraseña}
            className="border-3 border-dark rounded-3 py-3"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontFamily: "'Lato', sans-serif"
            }}
            placeholder="Repite tu nueva contraseña"
          />
          <Form.Control.Feedback type="invalid" style={{ fontFamily: "'Lato', sans-serif" }}>
            {errores.confirmarContraseña}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="text-center">
          <Button 
            type="submit" 
            className="rounded-pill px-5 py-3 border-3 border-dark fw-bold"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000',
              transition: 'all 0.3s ease',
              fontFamily: "'Lato', sans-serif",
              fontSize: '1.1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(222, 221, 143, 0.6)';
              e.target.style.backgroundColor = '#FFD700';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#dedd8ff5';
            }}
          >
            🔑 Actualizar Contraseña
          </Button>
        </div>

        <div className="text-center mt-3">
          <p style={{ color: '#000000', fontSize: '0.9rem' }}>
            <span style={{ color: 'red' }}>*</span> Campos obligatorios
          </p>
        </div>
      </Form>
    </>
  );
};

export default Seguridad;