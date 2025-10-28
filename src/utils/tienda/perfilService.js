// Servicio para manejar las operaciones del perfil de usuario
export const perfilService = {
  /**
   * Actualiza el perfil del usuario
   * @param {string} userId - ID del usuario
   * @param {Object} datos - Datos actualizados del perfil
   * @returns {Promise<Object>} Resultado de la operación
   */
  async actualizarPerfil(userId, datos) {
    try {
      // Simular llamada a API
      console.log('Actualizando perfil para usuario:', userId);
      console.log('Datos a actualizar:', datos);
      
      // Aquí iría la lógica real para actualizar en la base de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Perfil actualizado correctamente',
        user: datos
      };
    } catch (error) {
      console.error('Error en perfilService.actualizarPerfil:', error);
      return {
        success: false,
        message: 'Error al actualizar el perfil'
      };
    }
  },

  /**
   * Valida los datos del formulario de perfil
   * @param {Object} datos - Datos a validar
   * @returns {Object} Objeto con errores de validación
   */
  validarDatosPerfil(datos) {
    const errores = {};

    if (!datos.nombre || datos.nombre.trim().length < 2) {
      errores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!datos.apellido || datos.apellido.trim().length < 2) {
      errores.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!datos.email || !this.validarEmail(datos.email)) {
      errores.email = 'Ingresa un email válido';
    }

    if (datos.telefono && !this.validarTelefono(datos.telefono)) {
      errores.telefono = 'Ingresa un teléfono válido (9 dígitos)';
    }

    return errores;
  },

  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida formato de teléfono chileno
   * @param {string} telefono - Teléfono a validar
   * @returns {boolean} True si es válido
   */
  validarTelefono(telefono) {
    const telefonoRegex = /^[0-9]{9}$/;
    return telefonoRegex.test(telefono.replace(/\s/g, ''));
  },

  /**
   * Obtiene las regiones y comunas (podría venir de una API)
   * @returns {Array} Lista de regiones
   */
  obtenerRegiones() {
    // En una implementación real, esto vendría de una API
    return [];
  }
};

export default perfilService;