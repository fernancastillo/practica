import { authService } from '../tienda/auth';

/**
 * Verifica si el usuario puede acceder al admin
 * @returns {boolean} true si puede acceder, false si no
 */
export const canAccessAdmin = () => {
  if (!authService.isAuthenticated()) {
    return false;
  }
  
  const currentUser = authService.getCurrentUser();
  console.log('🔍 Verificando acceso admin para usuario:', currentUser);
  
  // ✅ CORREGIDO: Verificar múltiples tipos de admin
  const userType = currentUser?.tipo || currentUser?.type || '';
  const isAdmin = userType === 'Admin' || 
                  userType === 'Administrador' || 
                  userType === 'admin' ||
                  userType === 'administrador';
  
  console.log('👤 Tipo de usuario:', userType);
  console.log('🔑 Es admin:', isAdmin);
  
  return isAdmin;
};

/**
 * Redirige según el tipo de usuario
 * @returns {string} ruta a la que debe redirigir
 */
export const getRedirectRoute = () => {
  if (!authService.isAuthenticated()) {
    console.log('🔐 Usuario no autenticado, redirigiendo a login');
    return '/login';
  }
  
  const currentUser = authService.getCurrentUser();
  const userType = currentUser?.tipo || currentUser?.type || '';
  const isAdmin = userType === 'Admin' || 
                  userType === 'Administrador' || 
                  userType === 'admin' ||
                  userType === 'administrador';
  
  if (!isAdmin) {
    console.log('🚫 Usuario no es admin, redirigiendo a index');
    console.log('👤 Tipo de usuario detectado:', userType);
    return '/index';
  }
  
  console.log('✅ Usuario es admin, permitiendo acceso');
  return null; // No redirigir, puede acceder
};

/**
 * Hook para protección de rutas (opcional - para usar en componentes)
 */
export const useAdminAccess = () => {
  const canAccess = canAccessAdmin();
  const redirectTo = getRedirectRoute();
  
  return {
    canAccess,
    redirectTo,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: canAccess
  };
};