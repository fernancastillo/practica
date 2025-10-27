export const registroValidaciones = {
  validarNombre(nombre) {
    return nombre.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
  },

  validarApellido(apellido) {
    return apellido.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido);
  },

  validarRUN(run) {
    // Formato: 12345678-9 (opcional el guion)
    const runRegex = /^[0-9]{7,8}-?[0-9kK]{1}$/;
    return runRegex.test(run);
  },

  validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const esDuoc = email.endsWith('@duoc.cl') || email.endsWith('@duocuc.cl');
    return {
      valido: emailRegex.test(email),
      esDuoc: esDuoc
    };
  },

  validarFono(fono) {
    // Mínimo 8 dígitos, puede tener +56
    const fonoRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return fonoRegex.test(fono);
  },

  validarPassword(password) {
    return password.length >= 6;
  },

  validarConfirmarPassword(password, confirmarPassword) {
    return password === confirmarPassword;
  },

  validarEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      return edad - 1;
    }
    return edad;
  },

  validarTerminos(aceptado) {
    return aceptado;
  },

  // Validación completa del formulario
  validarFormularioCompleto(formData) {
    const errores = {};

    // Validar nombre
    if (!this.validarNombre(formData.nombre)) {
      errores.nombre = 'El nombre debe tener al menos 3 caracteres y solo letras';
    }

    // Validar apellido
    if (!this.validarApellido(formData.apellido)) {
      errores.apellido = 'El apellido debe tener al menos 3 caracteres y solo letras';
    }

    // Validar RUN
    if (!this.validarRUN(formData.run)) {
      errores.run = 'El RUN debe tener formato 12345678-9';
    }

    // Validar email
    const validacionEmail = this.validarEmail(formData.email);
    if (!validacionEmail.valido) {
      errores.email = 'Ingrese un email válido';
    }

    // Validar fono
    if (!this.validarFono(formData.fono)) {
      errores.fono = 'Ingrese un teléfono válido';
    }

    // Validar dirección
    if (!formData.direccion || formData.direccion.length < 5) {
      errores.direccion = 'La dirección debe tener al menos 5 caracteres';
    }

    // Validar comuna
    if (!formData.comuna) {
      errores.comuna = 'Seleccione una comuna';
    }

    // Validar región
    if (!formData.region) {
      errores.region = 'Seleccione una región';
    }

    // Validar password
    if (!this.validarPassword(formData.password)) {
      errores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de password
    if (!this.validarConfirmarPassword(formData.password, formData.confirmarPassword)) {
      errores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    // Validar edad
    if (formData.fechaNacimiento) {
      const edad = this.validarEdad(formData.fechaNacimiento);
      if (edad < 10) {
        errores.fechaNacimiento = 'Debes tener al menos 10 años para registrarte';
      }
    } else {
      errores.fechaNacimiento = 'La fecha de nacimiento es requerida';
    }

    // Validar términos
    if (!this.validarTerminos(formData.aceptoTerminos)) {
      errores.aceptoTerminos = 'Debes aceptar los términos y condiciones';
    }

    return {
      esValido: Object.keys(errores).length === 0,
      errores: errores
    };
  }
};