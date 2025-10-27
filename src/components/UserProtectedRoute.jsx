import React from 'react';
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  // Verificación que coincide con authService
  const getCurrentUser = () => {
    try {
      // 1. Buscar en 'auth_user' (como guarda authService)
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        console.log('✅ Usuario encontrado en auth_user');
        return JSON.parse(authUser);
      }
      
      // 2. Buscar en 'currentUser' (para compatibilidad)
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        console.log('✅ Usuario encontrado en currentUser');
        return JSON.parse(currentUser);
      }
      
      // 3. Buscar en sessionStorage
      const sessionAuthUser = sessionStorage.getItem('auth_user');
      if (sessionAuthUser) {
        console.log('✅ Usuario encontrado en sessionStorage.auth_user');
        return JSON.parse(sessionAuthUser);
      }

      console.log('❌ No se encontró usuario en auth_user ni currentUser');
      return null;

    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  
  console.log(' Estado de autenticación:', {
    tieneUsuario: !!currentUser,
    usuario: currentUser,
    claveEncontrada: currentUser ? 'auth_user' : 'ninguna'
  });

  if (!currentUser) {
    console.log(' Redirigiendo a login - usuario no autenticado');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Acceso permitido - usuario autenticado correctamente');
  return children;
};

export default UserProtectedRoute;