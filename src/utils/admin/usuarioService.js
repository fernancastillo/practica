// src/utils/admin/usuarioService.js
import usuariosData from '../../data/usuarios.json';

const STORAGE_KEY_USUARIOS = 'app_usuarios'; // Usar la colección existente app_usuarios
const STORAGE_KEY_ORDENES = 'app_ordenes';

// Enriquecer datos con información de órdenes para estadísticas
const enriquecerUsuariosConEstadisticas = (usuarios, ordenes = []) => {
  return usuarios.map(usuario => {
    const ordenesUsuario = ordenes.filter(orden => orden.run === usuario.run);
    const totalCompras = ordenesUsuario.length;
    const totalGastado = ordenesUsuario.reduce((sum, orden) => sum + orden.total, 0);
    
    return {
      ...usuario,
      id: usuario.run, // Usar RUN como ID
      fechaRegistro: '01/01/2024', // Fecha por defecto
      totalCompras,
      totalGastado,
      // Campos compatibles con tu JSON
      email: usuario.correo,
      telefono: usuario.telefono.toString(),
      direccion: `${usuario.direccion}, ${usuario.comuna}, ${usuario.region}`
    };
  });
};

export const usuarioService = {
  async getUsuarios() {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Primero intentar obtener usuarios de app_usuarios (colección existente)
  const storedUsuarios = localStorage.getItem(STORAGE_KEY_USUARIOS);
  
  // Obtener órdenes para calcular estadísticas
  let ordenes = [];
  try {
    const storedOrdenes = localStorage.getItem(STORAGE_KEY_ORDENES);
    if (storedOrdenes) {
      ordenes = JSON.parse(storedOrdenes);
    }
  } catch (error) {
    console.warn('No se pudieron cargar las órdenes para estadísticas:', error);
  }
  
  let usuariosEnriquecidos;
  
  if (storedUsuarios) {
    // Usar usuarios existentes de app_usuarios
    usuariosEnriquecidos = JSON.parse(storedUsuarios);
    
    // Actualizar estadísticas basadas en órdenes actuales
    // PERO mantener los totalGastado individuales de cada usuario
    usuariosEnriquecidos = usuariosEnriquecidos.map(usuario => {
      const ordenesUsuario = ordenes.filter(orden => orden.run === usuario.run);
      const totalCompras = ordenesUsuario.length;
      
      // Solo actualizar totalGastado si no tiene valor o es 0
      // Esto preserva los datos históricos incluso si el usuario es eliminado después
      const totalGastado = usuario.totalGastado > 0 
        ? usuario.totalGastado 
        : ordenesUsuario.reduce((sum, orden) => sum + orden.total, 0);
      
      return {
        ...usuario,
        totalCompras,
        totalGastado
      };
    });
  } else {
    // Si no existe app_usuarios, crear desde datos iniciales y guardar en app_usuarios
    usuariosEnriquecidos = enriquecerUsuariosConEstadisticas(usuariosData, ordenes);
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuariosEnriquecidos));
  }
  
  return usuariosEnriquecidos;
},

  async createUsuario(usuarioData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const usuarios = await this.getUsuarios();
    
    // Verificar que no exista un usuario con el mismo RUN
    const usuarioExistente = usuarios.find(u => u.run === usuarioData.run);
    if (usuarioExistente) {
      throw new Error('Ya existe un usuario con este RUN');
    }

    // Verificar que no exista un usuario con el mismo email
    const emailExistente = usuarios.find(u => u.correo === usuarioData.correo);
    if (emailExistente) {
      throw new Error('Ya existe un usuario con este email');
    }

    // Crear nuevo usuario con datos completos
    const nuevoUsuario = {
      ...usuarioData,
      // Campos adicionales para consistencia
      estado: 'Activo',
      totalCompras: 0,
      totalGastado: 0,
      fechaRegistro: new Date().toISOString().split('T')[0], // Fecha actual
      // Asegurar que todos los campos tengan valores
      telefono: usuarioData.telefono || '',
      direccion: usuarioData.direccion || '',
      comuna: usuarioData.comuna || '',
      region: usuarioData.region || '',
      fecha_nacimiento: usuarioData.fecha_nacimiento || ''
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
    
    return nuevoUsuario;
  },

  async updateUsuario(run, datosActualizados) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const usuarios = await this.getUsuarios();
    const usuarioIndex = usuarios.findIndex(u => u.run === run);
    
    if (usuarioIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Validar que el RUN no se modifique
    if (datosActualizados.run && datosActualizados.run !== run) {
      throw new Error('No se puede modificar el RUN del usuario');
    }
    
    // Validar que el tipo no se modifique
    if (datosActualizados.tipo && datosActualizados.tipo !== usuarios[usuarioIndex].tipo) {
      throw new Error('No se puede modificar el tipo de usuario');
    }

    // Validar email único (si se está modificando)
    if (datosActualizados.correo && datosActualizados.correo !== usuarios[usuarioIndex].correo) {
      const emailExistente = usuarios.find(u => u.correo === datosActualizados.correo && u.run !== run);
      if (emailExistente) {
        throw new Error('Ya existe un usuario con este email');
      }
    }
    
    // Actualizar usuario manteniendo los campos existentes
    usuarios[usuarioIndex] = { 
      ...usuarios[usuarioIndex], 
      ...datosActualizados,
      // Mantener campos críticos
      run: usuarios[usuarioIndex].run,
      tipo: usuarios[usuarioIndex].tipo
      // Las estadísticas (totalCompras, totalGastado) se mantienen automáticamente
      // porque no se incluyen en datosActualizados
    };
    
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
    return usuarios[usuarioIndex];
  },

  async getUsuarioByRun(run) {
    const usuarios = await this.getUsuarios();
    return usuarios.find(u => u.run === run);
  },

  async deleteUsuario(run) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const usuarios = await this.getUsuarios();
    const usuarioIndex = usuarios.findIndex(u => u.run === run);
    
    if (usuarioIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    const usuario = usuarios[usuarioIndex];
    
    // Solo validar que no sea administrador
    if (usuario.tipo === 'Admin') {
      throw new Error('No se puede eliminar un usuario administrador');
    }
    
    // ✅ PERMITIR eliminar aunque tenga compras
    usuarios.splice(usuarioIndex, 1);
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
    return true;
  },

  // Método para sincronizar con datos existentes en app_usuarios
  async sincronizarConAppUsuarios() {
    try {
      // Obtener usuarios actuales de app_usuarios
      const storedUsuarios = localStorage.getItem(STORAGE_KEY_USUARIOS);
      if (!storedUsuarios) {
        return await this.getUsuarios(); // Si no existe, crear desde datos iniciales
      }
      
      const usuariosExistentes = JSON.parse(storedUsuarios);
      
      // Obtener órdenes para actualizar estadísticas
      let ordenes = [];
      try {
        const storedOrdenes = localStorage.getItem(STORAGE_KEY_ORDENES);
        if (storedOrdenes) {
          ordenes = JSON.parse(storedOrdenes);
        }
      } catch (error) {
        console.warn('No se pudieron cargar las órdenes para sincronización:', error);
      }
      
      // Actualizar estadísticas de cada usuario
      const usuariosActualizados = usuariosExistentes.map(usuario => {
        const ordenesUsuario = ordenes.filter(orden => orden.run === usuario.run);
        const totalCompras = ordenesUsuario.length;
        const totalGastado = ordenesUsuario.reduce((sum, orden) => sum + orden.total, 0);
        
        return {
          ...usuario,
          totalCompras,
          totalGastado
        };
      });
      
      localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuariosActualizados));
      return usuariosActualizados;
      
    } catch (error) {
      console.error('Error sincronizando usuarios:', error);
      throw error;
    }
  }
};