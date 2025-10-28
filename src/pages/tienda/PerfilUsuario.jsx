import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../utils/tienda/authService';
import { perfilValidaciones } from '../../utils/tienda/perfilValidaciones';
import PerfilTabs from '../../components/tienda/PerfilTabs';
import PerfilHeader from '../../components/tienda/PerfilHeader';
import LoadingState from '../../components/tienda/LoadingState';
import UnauthorizedState from '../../components/tienda/UnauthorizedState';
import regionesComunasData from '../../data/regiones_comunas.json';

const PerfilUsuario = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [errores, setErrores] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Función para obtener los datos completos del usuario desde app_usuarios
  const obtenerUsuarioCompleto = (usuarioAuth) => {
    try {
      const usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
      const usuarioCompleto = usuarios.find(u => u.run === usuarioAuth.run);
      
      if (usuarioCompleto) {
        return {
          ...usuarioAuth,
          telefono: usuarioCompleto.telefono,
          fecha_nacimiento: usuarioCompleto.fecha_nacimiento,
          contrasenha: usuarioCompleto.contrasenha,
          tipo: usuarioCompleto.tipo
        };
      }
      
      return usuarioAuth;
    } catch (error) {
      console.error('Error al obtener usuario completo:', error);
      return usuarioAuth;
    }
  };

  // Función para encontrar el ID de región por nombre
  const encontrarIdRegionPorNombre = (nombreRegion) => {
    if (!nombreRegion) return '';
    
    const regionEncontrada = regionesComunasData.regiones.find(region => {
      const nombreRegionLower = nombreRegion.toLowerCase();
      const regionNombreLower = region.nombre.toLowerCase();
      
      return (
        regionNombreLower === nombreRegionLower ||
        regionNombreLower.includes(nombreRegionLower) ||
        nombreRegionLower.includes(regionNombreLower) ||
        regionNombreLower.replace('región', '').trim() === nombreRegionLower.replace('región', '').trim()
      );
    });
    
    return regionEncontrada ? regionEncontrada.id.toString() : '';
  };

  // Función para encontrar el nombre de región por ID
  const encontrarNombreRegionPorId = (idRegion) => {
    if (!idRegion) return '';
    
    const regionEncontrada = regionesComunasData.regiones.find(region => 
      region.id.toString() === idRegion.toString()
    );
    
    return regionEncontrada ? regionEncontrada.nombre : '';
  };

  // Función para normalizar los datos del usuario al formato del formulario
  const normalizarDatosUsuario = (usuarioCompleto) => {
    const regionId = encontrarIdRegionPorNombre(usuarioCompleto.region);
    const telefonoNormalizado = usuarioCompleto.telefono 
      ? usuarioCompleto.telefono.toString() 
      : '';
    
    return {
      nombre: usuarioCompleto.nombre || '',
      apellido: usuarioCompleto.apellidos || usuarioCompleto.apellido || '',
      email: usuarioCompleto.correo || usuarioCompleto.email || '',
      telefono: telefonoNormalizado,
      direccion: usuarioCompleto.direccion || '',
      region: regionId,
      comuna: usuarioCompleto.comuna || ''
    };
  };

  // Función para convertir datos del formulario al formato de almacenamiento
  const convertirParaAlmacenamiento = (formData, usuarioOriginal) => {
    const regionNombre = encontrarNombreRegionPorId(formData.region);
    
    return {
      run: usuarioOriginal.run,
      nombre: formData.nombre,
      apellidos: formData.apellido,
      correo: formData.email,
      contrasenha: usuarioOriginal.contrasenha,
      telefono: formData.telefono ? parseInt(formData.telefono) || 0 : 0,
      fecha_nacimiento: usuarioOriginal.fecha_nacimiento,
      tipo: usuarioOriginal.tipo,
      region: regionNombre,
      comuna: formData.comuna,
      direccion: formData.direccion
    };
  };

  // Validar campo individual
  const validarCampo = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'nombre':
      case 'apellido':
        error = perfilValidaciones.validarNombre(value);
        break;
      case 'email':
        error = perfilValidaciones.validarEmail(value, user);
        break;
      case 'telefono':
        error = perfilValidaciones.validarTelefono(value);
        break;
      case 'direccion':
        error = perfilValidaciones.validarDireccion(value);
        break;
      case 'region':
        error = perfilValidaciones.validarRegion(value);
        break;
      case 'comuna':
        error = perfilValidaciones.validarComuna(value, formData.region);
        break;
      default:
        break;
    }
    
    return error;
  };

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        const usuarioCompleto = obtenerUsuarioCompleto(currentUser);
        setUser(usuarioCompleto);
        
        const datosNormalizados = normalizarDatosUsuario(usuarioCompleto);
        setFormData(datosNormalizados);
        
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

    if (touched[name]) {
      const error = validarCampo(name, value);
      setErrores(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validarCampo(name, value);
    setErrores(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const todosLosCampos = {
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
      direccion: true,
      region: true,
      comuna: true
    };
    setTouched(todosLosCampos);
    
    const validacion = perfilValidaciones.validarFormularioCompleto(formData, user);
    setErrores(validacion.errores);
    
    if (!validacion.esValido) {
      console.log('❌ Errores de validación:', validacion.errores);
      
      const primerError = Object.keys(validacion.errores).find(key => validacion.errores[key]);
      if (primerError) {
        const elementoError = document.querySelector(`[name="${primerError}"]`);
        if (elementoError) {
          elementoError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          elementoError.focus();
        }
      }
      
      return;
    }
    
    try {
      console.log('💾 Guardando cambios válidos...', formData);
      
      const usuarios = JSON.parse(localStorage.getItem('app_usuarios')) || [];
      const usuarioIndex = usuarios.findIndex(u => u.run === user.run);
      
      if (usuarioIndex === -1) {
        console.error('❌ Usuario no encontrado en app_usuarios');
        return;
      }
      
      const usuarioOriginal = usuarios[usuarioIndex];
      const usuarioActualizado = convertirParaAlmacenamiento(formData, usuarioOriginal);
      
      usuarios[usuarioIndex] = usuarioActualizado;
      localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
      
      const usuarioSesionActualizado = {
        ...usuarioActualizado,
        id: usuarioActualizado.run,
        apellido: usuarioActualizado.apellidos,
        email: usuarioActualizado.correo,
        type: usuarioActualizado.tipo
      };
      localStorage.setItem('auth_user', JSON.stringify(usuarioSesionActualizado));
      
      const usuarioCompletoActualizado = obtenerUsuarioCompleto(usuarioSesionActualizado);
      setUser(usuarioCompletoActualizado);
      
      // Mostrar modal de éxito en lugar del alert
      setShowSuccessModal(true);
      
      console.log('✅ Perfil actualizado exitosamente');
      
    } catch (error) {
      console.error('💥 Error al actualizar perfil:', error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return <UnauthorizedState navigate={navigate} />;
  }

  return (
    <div 
      className="min-vh-100 w-100"
      style={{
        backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <div style={{ height: '80px' }}></div>
      
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <PerfilHeader />
          </Col>
        </Row>

        {showAlert && (
          <Alert 
            variant="success" 
            className="mb-4 text-center border-3 border-dark rounded-4"
            style={{
              backgroundColor: '#87CEEB',
              color: '#000000',
              fontWeight: '600'
            }}
          >
            ✅ Perfil actualizado correctamente
          </Alert>
        )}

        <PerfilTabs 
          formData={formData}
          onInputChange={handleInputChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          errores={errores}
        />
      </Container>

      {/* Modal de éxito */}
      <Modal
        show={showSuccessModal}
        onHide={handleCloseSuccessModal}
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
              ✅ ¡Perfil Actualizado!
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
              ¡Cambios Guardados Exitosamente!
            </h4>
            <p 
              className="fs-5"
              style={{ 
                color: '#000000',
                fontWeight: '500'
              }}
            >
              Tu información personal ha sido actualizada correctamente.
            </p>
            <p 
              className="fs-6"
              style={{ 
                color: '#000000',
                fontWeight: '400'
              }}
            >
              Los cambios se han aplicado a tu perfil y estarán disponibles inmediatamente.
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
            onClick={handleCloseSuccessModal}
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
    </div>
  );
};

export default PerfilUsuario;