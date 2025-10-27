import { saveLocalstorage, loadFromLocalstorage } from '../localstorageHelper';

const USERS_KEY = 'junimo_usuarios';

export const registroService = {
  registrarUsuario: (usuarioData) => {
    try {
      // Obtener usuarios existentes
      const usuariosExistentes = loadFromLocalstorage(USERS_KEY) || [];
      
      // Verificar si el email ya existe
      const emailExiste = usuariosExistentes.some(usuario => 
        usuario.email === usuarioData.email
      );
      
      if (emailExiste) {
        return {
          success: false,
          error: 'Este email ya está registrado'
        };
      }

      // Verificar si el RUN ya existe
      const runExiste = usuariosExistentes.some(usuario => 
        usuario.run === usuarioData.run
      );
      
      if (runExiste) {
        return {
          success: false,
          error: 'Este RUN ya está registrado'
        };
      }

      // Aplicar descuento si es email Duoc
      const esDuoc = usuarioData.email.endsWith('@duoc.cl') || usuarioData.email.endsWith('@duocuc.cl');
      
      // Crear nuevo usuario con todos los campos
      const nuevoUsuario = {
        id: Date.now(),
        run: usuarioData.run,
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido,
        email: usuarioData.email,
        fono: usuarioData.fono,
        direccion: usuarioData.direccion,
        comuna: usuarioData.comuna,
        region: usuarioData.region,
        fechaNacimiento: usuarioData.fechaNacimiento,
        contrasenha: usuarioData.password,
        tipo: 'Cliente',
        descuento: esDuoc ? '15%' : '0%',
        esDuoc: esDuoc,
        fechaRegistro: new Date().toISOString(),
        activo: true
      };

      // Guardar usuario
      usuariosExistentes.push(nuevoUsuario);
      saveLocalstorage(USERS_KEY, usuariosExistentes);

      console.log('Usuario registrado exitosamente:', nuevoUsuario);
      
      return {
        success: true,
        user: nuevoUsuario,
        message: esDuoc ? 
          '¡Registro exitoso! Obtienes 15% de descuento por ser estudiante Duoc.' : 
          '¡Registro exitoso! Bienvenido a Junimo Store.'
      };

    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: 'Error al registrar usuario'
      };
    }
  },

  verificarEmailExistente: (email) => {
    const usuariosExistentes = loadFromLocalstorage(USERS_KEY) || [];
    return usuariosExistentes.some(usuario => usuario.email === email);
  },

  verificarRUNExistente: (run) => {
    const usuariosExistentes = loadFromLocalstorage(USERS_KEY) || [];
    return usuariosExistentes.some(usuario => usuario.run === run);
  },

  obtenerUsuarios: () => {
    return loadFromLocalstorage(USERS_KEY) || [];
  },

  obtenerUsuarioPorEmail: (email) => {
    const usuariosExistentes = loadFromLocalstorage(USERS_KEY) || [];
    return usuariosExistentes.find(usuario => usuario.email === email);
  }
};