// src/utils/tienda/authService.js
import { saveLocalstorage, loadFromLocalstorage, deleteFromLocalstorage } from '../localstorageHelper';

const AUTH_KEY = 'auth_user';
const USER_TYPE_KEY = 'user_type';
const USUARIOS_KEY = 'app_usuarios';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('🔐 LOGIN INICIADO - Email:', email);
      
      // 1. PRIMERO buscar en usuarios registrados (localStorage)
      const usuariosRegistrados = loadFromLocalstorage(USUARIOS_KEY) || [];
      console.log('🔐 Usuarios en localStorage:', usuariosRegistrados.length);
      
      // Buscar usuario específico - usando "correo" y "contrasenha" del JSON
      const usuarioRegistrado = usuariosRegistrados.find(u => {
        const emailMatch = u.correo === email;
        const passwordMatch = u.contrasenha === password;
        console.log(`🔐 Verificando usuario: ${u.correo}, email match: ${emailMatch}, password match: ${passwordMatch}`);
        return emailMatch && passwordMatch;
      });
      
      console.log('🔐 Usuario encontrado en registro:', usuarioRegistrado ? 'Sí' : 'No');
      
      if (usuarioRegistrado) {
        console.log('✅ USUARIO ENCONTRADO EN REGISTRO - Login exitoso');
        console.log('👤 Tipo de usuario:', usuarioRegistrado.tipo);
        console.log('👤 Datos completos del usuario:', usuarioRegistrado);
        
        // ✅ CORREGIDO: Normalizar el tipo de usuario
// Normaliza el tipo de usuario sin importar mayúsculas/minúsculas
const tipoUsuario = (() => {
  const tipo = (usuarioRegistrado.tipo || '').toLowerCase();
  if (tipo === 'admin' || tipo === 'administrador') return 'Administrador';
  if (tipo === 'cliente') return 'Cliente';
  return usuarioRegistrado.tipo;
})();

        
        const userData = {
          id: usuarioRegistrado.run,
          nombre: usuarioRegistrado.nombre,
          apellido: usuarioRegistrado.apellidos || '',
          email: usuarioRegistrado.correo,
          type: tipoUsuario, // ✅ Usar el tipo normalizado
          loginTime: new Date().toISOString(),
          run: usuarioRegistrado.run,
          direccion: usuarioRegistrado.direccion,
          comuna: usuarioRegistrado.comuna,
          region: usuarioRegistrado.region
        };
        
        saveLocalstorage(AUTH_KEY, userData);
        saveLocalstorage(USER_TYPE_KEY, tipoUsuario); // ✅ Guardar tipo normalizado
        
        console.log('✅ Usuario guardado en sesión:', userData);
        
        // ✅ CORREGIDO: Determinar redirección basada en el tipo de usuario normalizado
        const redirectTo = tipoUsuario === 'Administrador' ? '/admin/dashboard' : '/index';
        console.log('🔄 Redirigiendo a:', redirectTo);
        
        // Notificar a otros componentes
        window.dispatchEvent(new Event('authStateChanged'));
        
        return {
          success: true,
          user: userData,
          redirectTo: redirectTo
        };
      }
      
      // 2. LUEGO buscar en usuarios.json (solo para admins predefinidos)
      try {
        console.log('🔐 Buscando en usuarios predefinidos...');
        const usuariosData = await import('../../data/usuarios.json');
        const userPredefinido = usuariosData.default.find(u => {
          const emailMatch = u.correo === email;
          const passwordMatch = u.contrasenha === password;
          console.log(`🔐 Verificando usuario predefinido: ${u.correo}, tipo: ${u.tipo}, email match: ${emailMatch}, password match: ${passwordMatch}`);
          return emailMatch && passwordMatch;
        });
        
        if (userPredefinido) {
          console.log('✅ Usuario predefinido encontrado');
          console.log('👤 Tipo de usuario predefinido:', userPredefinido.tipo);
          console.log('👤 Datos completos del usuario predefinido:', userPredefinido);
          
          // ✅ CORREGIDO: Normalizar el tipo de usuario para predefinidos también
          const tipoUsuario = userPredefinido.tipo === 'Admin' ? 'Administrador' : userPredefinido.tipo;
          console.log('👤 Tipo de usuario predefinido normalizado:', tipoUsuario);
          
          const userData = {
            id: userPredefinido.run,
            nombre: userPredefinido.nombre,
            apellido: userPredefinido.apellidos || '',
            email: userPredefinido.correo,
            type: tipoUsuario, // ✅ Usar el tipo normalizado
            loginTime: new Date().toISOString(),
            run: userPredefinido.run
          };
          
          saveLocalstorage(AUTH_KEY, userData);
          saveLocalstorage(USER_TYPE_KEY, tipoUsuario); // ✅ Guardar tipo normalizado
          
          // ✅ CORREGIDO: Determinar redirección basada en el tipo de usuario normalizado
          const redirectTo = tipoUsuario === 'Administrador' ? '/admin/dashboard' : '/index';
          console.log('🔄 Redirigiendo a:', redirectTo);
          
          window.dispatchEvent(new Event('authStateChanged'));
          
          return {
            success: true,
            user: userData,
            redirectTo: redirectTo
          };
        }
      } catch (jsonError) {
        console.log('ℹ️ No hay usuarios predefinidos, usando solo registro:', jsonError);
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
  const userType = getLocalstorage(USER_TYPE_KEY);
  return (userType || '').toLowerCase() === 'admin' || (userType || '').toLowerCase() === 'administrador';
},


  isClient: () => {
    const userType = loadFromLocalstorage(USER_TYPE_KEY);
    console.log('🔍 Verificando si es cliente - userType:', userType);
    return userType === 'Cliente';
  },

  emailExiste: (email) => {
    const usuariosRegistrados = loadFromLocalstorage(USUARIOS_KEY) || [];
    return usuariosRegistrados.some(usuario => usuario.correo === email);
  },

  notifyAuthChange: () => {
    window.dispatchEvent(new Event('authStateChanged'));
  }
};