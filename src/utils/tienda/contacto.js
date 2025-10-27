// Validaciones para el formulario de contacto
export const validarFormularioContacto = (formData) => {
  const errores = {};

  // Validar nombre
  if (!formData.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (formData.nombre.length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres';
  } else if (formData.nombre.length > 50) {
    errores.nombre = 'El nombre no puede tener más de 50 caracteres';
  }

  // Validar email
  if (!formData.email.trim()) {
    errores.email = 'El email es obligatorio';
  } else if (!validarEmail(formData.email)) {
    errores.email = 'El formato del email no es válido';
  }

  // Validar teléfono (opcional pero si existe debe ser válido)
  if (formData.telefono && !validarTelefono(formData.telefono)) {
    errores.telefono = 'El formato del teléfono no es válido';
  }

  // Validar asunto
  if (!formData.asunto) {
    errores.asunto = 'Debes seleccionar un asunto';
  }

  // Validar mensaje
  if (!formData.mensaje.trim()) {
    errores.mensaje = 'El mensaje es obligatorio';
  } else if (formData.mensaje.length < 10) {
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
  } else if (formData.mensaje.length > 1000) {
    errores.mensaje = 'El mensaje no puede tener más de 1000 caracteres';
  }

  return errores;
};

// Validar formato de email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar formato de teléfono chileno
export const validarTelefono = (telefono) => {
  // Acepta formatos: +56 9 1234 5678, 56912345678, 912345678, etc.
  const regex = /^(\+56\s?9?|569?)?\s?[2-9]\d{7}$/;
  return regex.test(telefono.replace(/\s/g, ''));
};

// Sanitizar datos del formulario
export const sanitizarDatosContacto = (formData) => {
  return {
    nombre: formData.nombre.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    email: formData.email.trim().toLowerCase(),
    telefono: formData.telefono ? formData.telefono.trim().replace(/\s/g, '') : '',
    asunto: formData.asunto,
    mensaje: formData.mensaje.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    fecha: new Date().toISOString()
  };
};

// Validar y formatear teléfono chileno
export const formatearTelefonoChileno = (telefono) => {
  if (!telefono) return '';
  
  // Remover todos los espacios y caracteres especiales
  const numeroLimpio = telefono.replace(/\D/g, '');
  
  // Si empieza con 9, asumir que es celular
  if (numeroLimpio.startsWith('9') && numeroLimpio.length === 9) {
    return `+56 ${numeroLimpio}`;
  }
  
  // Si empieza con 569, ya está en formato internacional
  if (numeroLimpio.startsWith('569') && numeroLimpio.length === 11) {
    return `+${numeroLimpio}`;
  }
  
  // Si tiene 8 dígitos, asumir que es número fijo
  if (numeroLimpio.length === 8) {
    return `+56 ${numeroLimpio}`;
  }
  
  return telefono;
};

// Simulación de API para el formulario de contacto
export const enviarFormularioContacto = async (datosFormulario) => {
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Aquí iría la llamada real a tu API
    // const response = await fetch('/api/contacto', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(datosFormulario),
    // });
    
    // Simular respuesta exitosa
    const respuestaSimulada = {
      success: true,
      message: 'Mensaje enviado correctamente',
      id: Math.random().toString(36).substr(2, 9)
    };
    
    return respuestaSimulada;
    
  } catch (error) {
    throw new Error('Error al enviar el formulario: ' + error.message);
  }
};

// Guardar en localStorage (para desarrollo/demo)
export const guardarContactoLocal = (datosContacto) => {
  try {
    const contactosGuardados = JSON.parse(localStorage.getItem('junimoContactos')) || [];
    const nuevoContacto = {
      ...datosContacto,
      id: Date.now().toString(),
      leido: false
    };
    
    contactosGuardados.unshift(nuevoContacto);
    localStorage.setItem('junimoContactos', JSON.stringify(contactosGuardados));
    
    return true;
  } catch (error) {
    console.error('Error al guardar contacto:', error);
    return false;
  }
};

// Obtener contactos guardados
export const obtenerContactosGuardados = () => {
  try {
    return JSON.parse(localStorage.getItem('junimoContactos')) || [];
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return [];
  }
};

// Utilidades para notificaciones
export const mostrarNotificacion = (tipo, mensaje) => {
  // Para usar con react-toastify o cualquier sistema de notificaciones
  const notificaciones = {
    success: () => console.log(`✅ ${mensaje}`), // Reemplazar con toast.success
    error: () => console.log(`❌ ${mensaje}`),   // Reemplazar con toast.error
    info: () => console.log(`ℹ️ ${mensaje}`)     // Reemplazar con toast.info
  };
  
  return notificaciones[tipo] ? notificaciones[tipo]() : null;
};

// Generar número de ticket para el contacto
export const generarNumeroTicket = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `JUNIMO-${timestamp.substr(-6)}-${random}`;
};

// Validar si el mensaje contiene palabras no permitidas
export const validarContenidoMensaje = (mensaje) => {
  const palabrasNoPermitidas = [
    'spam', 'phishing', 'malware', 'virus', 'estafa',
    'fraude', 'hack', 'criptomoneda', 'inversión', 'bitcoin'
  ];
  
  const mensajeLower = mensaje.toLowerCase();
  const palabrasEncontradas = palabrasNoPermitidas.filter(palabra => 
    mensajeLower.includes(palabra)
  );
  
  return {
    valido: palabrasEncontradas.length === 0,
    palabrasProhibidas: palabrasEncontradas
  };
};