import { authService } from '../tienda/auth';

/**
 * Verifica si el usuario puede acceder al admin
 * @returns {boolean} true si puede acceder, false si no
 */
export const canAccessAdmin = () => {
  return authService.isAuthenticated() && authService.isAdmin();
};

/**
 * Redirige según el tipo de usuario
 * @returns {string} ruta a la que debe redirigir
 */
export const getRedirectRoute = () => {
  if (!authService.isAuthenticated()) {
    return '/login';
  }
  if (!authService.isAdmin()) {
    return '/index';
  }
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
    isAdmin: authService.isAdmin()
  };
};