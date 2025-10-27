import { saveLocalstorage, loadFromLocalstorage, deleteFromLocalstorage } from '../localstorageHelper';

const AUTH_KEY = 'auth_user';
const USER_TYPE_KEY = 'user_type';
const USUARIOS_KEY = 'junimo_usuarios';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('🔐 LOGIN INICIADO - Email:', email, 'Password:', password);
      
      // 1. PRIMERO buscar en usuarios registrados (localStorage)
      const usuariosRegistrados = loadFromLocalstorage(USUARIOS_KEY) || [];
      console.log('🔐 Usuarios en localStorage:', usuariosRegistrados);
      
      // Buscar usuario específico
      const usuarioRegistrado = usuariosRegistrados.find(u => {
        console.log('🔐 Comparando:', u.email, 'con', email, 'y password:', u.contrasenha, 'con', password);
        return u.email === email && u.contrasenha === password;
      });
      
      console.log('🔐 Usuario encontrado:', usuarioRegistrado);
      
      if (usuarioRegistrado) {
        console.log('✅ USUARIO ENCONTRADO - Login exitoso');
        const userData = {
          id: usuarioRegistrado.id,
          nombre: usuarioRegistrado.nombre,
          apellido: usuarioRegistrado.apellido,
          email: usuarioRegistrado.email,
          type: usuarioRegistrado.tipo || 'Cliente',
          loginTime: new Date().toISOString(),
          descuento: usuarioRegistrado.descuento || '0%',
          fechaNacimiento: usuarioRegistrado.fechaNacimiento
        };
        
        saveLocalstorage(AUTH_KEY, userData);
        saveLocalstorage(USER_TYPE_KEY, usuarioRegistrado.tipo || 'Cliente');
        
        console.log('✅ Usuario guardado en sesión:', userData);
        
        // ✅ AGREGAR ESTA LÍNEA CRÍTICA - Notificar a otros componentes
        window.dispatchEvent(new Event('authStateChanged'));
        
        return {
          success: true,
          user: userData,
          redirectTo: '/index'
        };
      }
      
      // 2. LUEGO buscar en usuarios.json (solo para admins predefinidos)
      try {
        const usuariosData = await import('../../data/usuarios.json');
        const userPredefinido = usuariosData.default.find(u => 
          u.correo === email && u.contrasenha === password
        );
        
        if (userPredefinido) {
          console.log('✅ Usuario predefinido encontrado');
          const userData = {
            id: userPredefinido.run,
            nombre: userPredefinido.nombre,
            email: userPredefinido.correo,
            type: userPredefinido.tipo,
            loginTime: new Date().toISOString()
          };
          
          saveLocalstorage(AUTH_KEY, userData);
          saveLocalstorage(USER_TYPE_KEY, userPredefinido.tipo);
          
          // ✅ AGREGAR ESTA LÍNEA TAMBIÉN
          window.dispatchEvent(new Event('authStateChanged'));
          
          return {
            success: true,
            user: userData,
            redirectTo: userPredefinido.tipo === 'Admin' ? '/admin/dashboard' : '/index'
          };
        }
      } catch (jsonError) {
        console.log('ℹ️ No hay usuarios predefinidos, usando solo registro');
      }
      
      console.log('❌ USUARIO NO ENCONTRADO - Login fallido');
      return {
        success: false,
        error: 'Email o contraseña incorrectos'
      };
      
    } catch (error) {
      console.error('💥 Error en login:', error);
      return {
        success: false,
        error: 'Error del servidor, intenta más tarde'
      };
    }
  },

  logout: () => {
    deleteFromLocalstorage(AUTH_KEY);
    deleteFromLocalstorage(USER_TYPE_KEY);
    
    // ✅ AGREGAR ESTA LÍNEA TAMBIÉN PARA LOGOUT
    window.dispatchEvent(new Event('authStateChanged'));
    
    window.location.href = '/index';
  },

  isAuthenticated: () => {
    return loadFromLocalstorage(AUTH_KEY) !== null;
  },

  getCurrentUser: () => {
    return loadFromLocalstorage(AUTH_KEY);
  },

  getUserType: () => {
    return loadFromLocalstorage(USER_TYPE_KEY);
  },

  isAdmin: () => {
    return loadFromLocalstorage(USER_TYPE_KEY) === 'Admin';
  },

  isClient: () => {
    return loadFromLocalstorage(USER_TYPE_KEY) === 'Cliente';
  },

  emailExiste: (email) => {
    const usuariosRegistrados = loadFromLocalstorage(USUARIOS_KEY) || [];
    return usuariosRegistrados.some(usuario => usuario.email === email);
  },

  // ✅ AGREGAR ESTA FUNCIÓN PARA FORZAR ACTUALIZACIÓN
  notifyAuthChange: () => {
    window.dispatchEvent(new Event('authStateChanged'));
  }
};