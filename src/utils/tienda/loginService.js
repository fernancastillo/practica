import { authService } from './authService';

export const useLoginLogic = () => {
  const handleLogin = async (email, password) => {
    try {
      console.log('🔄 Iniciando proceso de login...');
      console.log('📧 Email:', email);
      
      const result = await authService.login(email, password);
      
      console.log('📋 Resultado del login:', result);
      
      return result;
    } catch (error) {
      console.error('💥 Error en login:', error);
      throw error;
    }
  };

  const getRedirectPath = (userType) => {
    const isAdmin = userType === 'Administrador' || userType === 'Admin';
    return isAdmin ? '/admin/dashboard' : '/index';
  };

  const checkExistingAuth = (navigate) => {
    if (authService.isAuthenticated()) {
      const userType = authService.getUserType();
      const currentUser = authService.getCurrentUser();
      console.log('🔄 Usuario ya autenticado - Redirigiendo...');
      console.log('👤 Tipo de usuario:', userType);
      console.log('👤 Usuario actual:', currentUser);
      
      const redirectTo = getRedirectPath(userType);
      
      console.log('🔄 Redirigiendo a:', redirectTo);
      navigate(redirectTo, { replace: true });
      return true;
    }
    return false;
  };

  return {
    handleLogin,
    getRedirectPath,
    checkExistingAuth
  };
};

export const loginValidations = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validatePassword: (password) => {
    return password && password.length >= 6;
  },
  
  validateForm: (email, password) => {
    const errors = [];
    
    if (!email) {
      errors.push('El email es requerido');
    } else if (!loginValidations.validateEmail(email)) {
      errors.push('El formato del email no es válido');
    }
    
    if (!password) {
      errors.push('La contraseña es requerida');
    } else if (!loginValidations.validatePassword(password)) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    return errors;
  }
};