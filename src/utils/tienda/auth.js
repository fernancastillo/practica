import { saveLocalstorage, loadFromLocalstorage, deleteFromLocalstorage } from '../localstorageHelper';
import usuariosData from '../../data/usuarios.json';

// Claves para localStorage
const AUTH_KEY = 'auth_user';
const USER_TYPE_KEY = 'user_type';

export const authService = {
  // Autenticar usuario desde el JSON
  login: async (email, password) => {
    try {
      console.log('Datos de usuarios cargados:', usuariosData); 
      
      const user = usuariosData.find(u => 
        u.correo === email && u.contrasenha === password 
      );
      
      if (user) {
        const userData = {
          id: user.run, 
          nombre: user.nombre,
          email: user.correo,
          type: user.tipo, 
          loginTime: new Date().toISOString()
        };
        
        saveLocalstorage(AUTH_KEY, userData);
        saveLocalstorage(USER_TYPE_KEY, user.tipo); 
        
        return {
          success: true,
          user: userData,
          redirectTo: user.tipo === 'Admin' ? '/admin/dashboard' : '/index' 
        };
      }
      
      return {
        success: false,
        error: 'Credenciales incorrectas'
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error del servidor'
      };
    }
  },

  // Cerrar sesión 
  logout: () => {
    deleteFromLocalstorage(AUTH_KEY);
    deleteFromLocalstorage(USER_TYPE_KEY);
    // Limpiar cualquier otra data de sesión si existe
    localStorage.removeItem('auth_user');
    localStorage.removeItem('user_type');
    
    console.log('Sesión cerrada correctamente');
    
    // Redirigir al inicio
    window.location.href = '/index';
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return loadFromLocalstorage(AUTH_KEY) !== null;
  },

  // Obtener datos del usuario actual
  getCurrentUser: () => {
    return loadFromLocalstorage(AUTH_KEY);
  },

  // Obtener tipo de usuario
  getUserType: () => {
    return loadFromLocalstorage(USER_TYPE_KEY);
  },

  // Verificar si es admin
  isAdmin: () => {
    return loadFromLocalstorage(USER_TYPE_KEY) === 'Admin';
  },

  // Verificar si es cliente
  isClient: () => {
    return loadFromLocalstorage(USER_TYPE_KEY) === 'Cliente';
  }
};