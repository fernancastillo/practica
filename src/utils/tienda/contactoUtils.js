// src/utils/tienda/contactoUtils.js

// Validación general de formulario
export const validarFormularioContacto = (datos) => {
  const errores = {};

  if ('nombre' in datos && !datos.nombre.trim()) errores.nombre = 'El nombre es obligatorio';
  if ('email' in datos && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email))
    errores.email = 'El email no es válido';
  if ('telefono' in datos && datos.telefono && !/^\d{9}$/.test(datos.telefono))
    errores.telefono = 'El teléfono debe tener 9 dígitos';
  if ('asunto' in datos && !datos.asunto.trim()) errores.asunto = 'Selecciona un asunto';
  if ('mensaje' in datos && datos.mensaje.trim().length < 10)
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres';

  return errores;
};

// Limpieza de datos
export const sanitizarDatosContacto = (datos) => {
  const limpiar = (str) => str.replace(/<[^>]*>?/gm, '').trim();
  return {
    nombre: limpiar(datos.nombre),
    email: limpiar(datos.email),
    telefono: limpiar(datos.telefono || ''),
    asunto: limpiar(datos.asunto),
    mensaje: limpiar(datos.mensaje)
  };
};

// Formato de número de teléfono chileno
export const formatearTelefonoChileno = (telefono) => {
  if (!telefono) return '';
  return `+56 9 ${telefono.slice(1, 5)} ${telefono.slice(5)}`;
};

// Simulación de envío de formulario
export const enviarFormularioContacto = async (datos) => {
  // Simula un retardo como si enviara a un servidor
  return new Promise((resolve) => {
    console.log('📤 Enviando formulario...', datos);
    setTimeout(() => resolve({ ok: true }), 1500);
  });
};

// Guardar datos localmente
export const guardarContactoLocal = (datos) => {
  const contactos = JSON.parse(localStorage.getItem('contactos')) || [];
  contactos.push({ ...datos, fecha: new Date().toISOString() });
  localStorage.setItem('contactos', JSON.stringify(contactos));
};

// Validación de contenido del mensaje
export const validarContenidoMensaje = (mensaje) => {
  const palabrasProhibidas = ['spam', 'publicidad', 'oferta', 'criptomonedas'];
  const contieneProhibidas = palabrasProhibidas.some(p => mensaje.toLowerCase().includes(p));
  return { valido: !contieneProhibidas };
};
