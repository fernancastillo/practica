// src/utils/tienda/registroService.js
import { dataService } from '../dataService';

export const registroService = {
  registrarUsuario: (usuarioData) => {
    try {
      console.log('🔍 Iniciando registro de usuario...');
      console.log('📦 Datos recibidos:', usuarioData);
      
      // Obtener usuarios existentes usando dataService
      const usuariosExistentes = dataService.getUsuarios();
      console.log('👥 Usuarios existentes:', usuariosExistentes.length);

      // Verificar si el email ya existe
      const emailExiste = usuariosExistentes.some(usuario => 
        usuario.correo === usuarioData.email
      );
      
      if (emailExiste) {
        console.log('❌ Email ya existe:', usuarioData.email);
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
        console.log('❌ RUN ya existe:', usuarioData.run);
        return {
          success: false,
          error: 'Este RUN ya está registrado'
        };
      }

      // Obtener nombre de la región
      const regionSeleccionada = usuarioData.regionNombre || 'Región no especificada';
      
      // Crear nuevo usuario con la estructura EXACTA del JSON (sin campos adicionales)
      const nuevoUsuario = {
        run: usuarioData.run,
        nombre: usuarioData.nombre,
        apellidos: `${usuarioData.apellido}`,
        correo: usuarioData.email,
        // NO incluir contraseña en el localStorage por seguridad
        telefono: usuarioData.fono ? parseInt(usuarioData.fono) : null,
        fecha_nacimiento: usuarioData.fechaNacimiento,
        tipo: 'Cliente',
        region: regionSeleccionada, // Usar el nombre de la región
        comuna: usuarioData.comuna,
        direccion: usuarioData.direccion
        // Eliminados: activo, descuento, esDuoc, fechaRegistro
      };

      console.log('👤 Nuevo usuario a guardar:', nuevoUsuario);

      // Guardar usuario usando dataService
      const usuarioGuardado = dataService.addUsuario(nuevoUsuario);
      console.log('✅ Usuario guardado exitosamente:', usuarioGuardado);

      // Verificar que realmente se guardó
      const usuariosActualizados = dataService.getUsuarios();
      console.log('📊 Total de usuarios después del registro:', usuariosActualizados.length);
      
      return {
        success: true,
        user: nuevoUsuario,
        message: '¡Registro exitoso! Bienvenido a Junimo Store.'
      };

    } catch (error) {
      console.error('❌ Error detallado en registro:', error);
      console.error('📊 Stack trace:', error.stack);
      return {
        success: false,
        error: error.message || 'Error al registrar usuario. Verifica la consola para más detalles.'
      };
    }
  },

  verificarEmailExistente: (email) => {
    const usuariosExistentes = dataService.getUsuarios();
    return usuariosExistentes.some(usuario => usuario.correo === email);
  },

  verificarRUNExistente: (run) => {
    const usuariosExistentes = dataService.getUsuarios();
    return usuariosExistentes.some(usuario => usuario.run === run);
  },

  obtenerUsuarios: () => {
    return dataService.getUsuarios();
  },

  obtenerUsuarioPorEmail: (email) => {
    const usuariosExistentes = dataService.getUsuarios();
    return usuariosExistentes.find(usuario => usuario.correo === email);
  }
};