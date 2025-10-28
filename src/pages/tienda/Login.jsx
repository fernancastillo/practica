import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

// Components
import LoginHeader from '../../components/tienda/LoginHeader';
import LoginForm from '../../components/tienda/LoginForm';
import { SuccessModal, ErrorModal } from '../../components/tienda/LoginModals';

// Utils
import { useLoginLogic, loginValidations } from '../../utils/tienda/loginService';
import { authService } from '../../utils/tienda/authService';

const Login = () => {
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
  const { handleLogin, getRedirectPath, checkExistingAuth } = useLoginLogic();

  // Verificar si ya está autenticado
  useEffect(() => {
    checkExistingAuth(navigate);
  }, [navigate]);

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

    // Validaciones del formulario
    const validationErrors = loginValidations.validateForm(formData.email, formData.password);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      setLoading(false);
      return;
    }

    try {
      const result = await handleLogin(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Login exitoso');
        console.log('👤 Usuario logueado:', result.user);
        console.log('👤 Tipo de usuario normalizado:', result.user.type);
        
        // Guardar resultado para mostrar en el modal
        setLoginResult({
          success: true,
          user: result.user,
          userType: result.user.type
        });
        setShowSuccessModal(true);
      } else {
        console.log('❌ Error en login:', result.error);
        setLoginResult({
          success: false,
          error: result.error
        });
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error('💥 Error en login:', err);
      setLoginResult({
        success: false,
        error: 'Error al iniciar sesión. Por favor, intenta nuevamente.'
      });
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    
    // Redirigir según el tipo de usuario
    const userType = authService.getUserType();
    const finalRedirectTo = getRedirectPath(userType);
    
    console.log('🔄 Redirección final a:', finalRedirectTo);
    navigate(finalRedirectTo, { replace: true });
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
        {/* Header con imagen */}
        <LoginHeader />

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <LoginForm 
              formData={formData}
              loading={loading}
              error={error}
              showPassword={showPassword}
              onInputChange={handleChange}
              onSubmit={handleSubmit}
              onTogglePassword={togglePasswordVisibility}
            />
          </Col>
        </Row>
      </Container>

      {/* Modales */}
      <SuccessModal 
        show={showSuccessModal}
        onHide={handleSuccessContinue}
        user={loginResult.user}
        userType={loginResult.userType}
      />

      <ErrorModal 
        show={showErrorModal}
        onHide={handleErrorContinue}
        error={loginResult.error}
      />
    </div>
  );
};

export default Login;