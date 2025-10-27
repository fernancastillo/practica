// src/utils/tienda/registroValidaciones.js
export const registroValidaciones = {
  validarNombre(nombre) {
    return nombre.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
  },

  validarApellido(apellido) {
    return apellido.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido);
  },

  validarRUN(run) {
    // Formato: 8-9 dígitos sin puntos ni guion
    const runRegex = /^[0-9]{8,9}$/;
    if (!runRegex.test(run)) {
      return {
        valido: false,
        mensaje: 'El RUN debe tener 8-9 dígitos sin puntos ni guion'
      };
    }

    // Validar dígito verificador usando algoritmo módulo 11
    return this.validarDigitoVerificadorRUN(run);
  },

  validarDigitoVerificadorRUN(run) {
    // Algoritmo módulo 11 para RUN chileno
    const runSinDV = run.slice(0, -1);
    const digitoVerificador = run.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplicador = 2;
    
    // Recorrer el RUN de derecha a izquierda
    for (let i = runSinDV.length - 1; i >= 0; i--) {
      suma += parseInt(runSinDV.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    let dvCalculado = 11 - resto;
    
    // Casos especiales del dígito verificador
    if (dvCalculado === 11) dvCalculado = 0;
    if (dvCalculado === 10) dvCalculado = 'K';
    
    const valido = dvCalculado.toString() === digitoVerificador;
    
    return {
      valido: valido,
      mensaje: valido ? '' : 'El RUN no es válido. Verifica el dígito verificador.'
    };
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
    // Si está vacío, es válido (opcional)
    if (!fono || fono.trim() === '') {
      return true;
    }
    // Si tiene valor, debe ser exactamente 9 dígitos y comenzar con 9
    const fonoRegex = /^9[0-9]{8}$/;
    return fonoRegex.test(fono);
  },

  validarPassword(password) {
    // La contraseña debe tener entre 4 y 10 caracteres
    return password.length >= 4 && password.length <= 10;
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

    // Validar RUN con dígito verificador
    const validacionRUN = this.validarRUN(formData.run);
    if (!validacionRUN.valido) {
      errores.run = validacionRUN.mensaje;
    }

    // Validar email
    const validacionEmail = this.validarEmail(formData.email);
    if (!validacionEmail.valido) {
      errores.email = 'Ingrese un email válido';
    }

    // Validar fono (solo si tiene valor)
    if (formData.fono && !this.validarFono(formData.fono)) {
      errores.fono = 'El teléfono debe tener 9 dígitos y comenzar con 9';
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

    // Validar password (4-10 caracteres)
    if (!this.validarPassword(formData.password)) {
      errores.password = 'La contraseña debe tener entre 4 y 10 caracteres';
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

    return {
      esValido: Object.keys(errores).length === 0,
      errores: errores
    };
  }
};