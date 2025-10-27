// src/components/tienda/ContactoLogic.jsx
import { useState } from 'react';
import { 
  validarFormularioContacto, 
  sanitizarDatosContacto,
  formatearTelefonoChileno,
  enviarFormularioContacto,
  guardarContactoLocal,
  validarContenidoMensaje
} from '../../utils/tienda/contactoUtils';

export const useContactoLogic = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMensaje, setAlertMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para teléfono
    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ 
        ...prev, 
        [name]: soloNumeros 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para teléfono
    if (name === 'telefono' && value) {
      if (value.length !== 9) {
        setErrores(prev => ({
          ...prev,
          telefono: 'El teléfono debe tener 9 dígitos'
        }));
        return;
      }
      if (!value.startsWith('9')) {
        setErrores(prev => ({
          ...prev,
          telefono: 'El teléfono debe comenzar con 9'
        }));
        return;
      }
    }
    
    // Validación en tiempo real al salir del campo
    if (value.trim()) {
      const erroresCampo = validarFormularioContacto({ [name]: value });
      if (erroresCampo[name]) {
        setErrores(prev => ({
          ...prev,
          [name]: erroresCampo[name]
        }));
      }
    }
  };

  const mostrarError = (mensaje, nuevosErrores = {}) => {
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
    }
    setAlertMensaje(mensaje);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const mostrarExito = (mensaje) => {
    setAlertMensaje(mensaje);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación especial para teléfono
    if (formData.telefono) {
      if (formData.telefono.length !== 9) {
        mostrarError('El teléfono debe tener 9 dígitos', { telefono: 'El teléfono debe tener 9 dígitos' });
        return;
      }
      if (!formData.telefono.startsWith('9')) {
        mostrarError('El teléfono debe comenzar con 9', { telefono: 'El teléfono debe comenzar con 9' });
        return;
      }
    }

    // Validar formulario completo
    const nuevosErrores = validarFormularioContacto(formData);
    if (Object.keys(nuevosErrores).length > 0) {
      mostrarError('Por favor corrige los errores en el formulario', nuevosErrores);
      return;
    }

    // Validar contenido del mensaje
    const validacionContenido = validarContenidoMensaje(formData.mensaje);
    if (!validacionContenido.valido) {
      mostrarError('El mensaje contiene contenido no permitido');
      return;
    }

    setEnviando(true);

    try {
      // Sanitizar datos
      const datosSanitizados = sanitizarDatosContacto(formData);
      
      // Formatear teléfono si existe
      if (datosSanitizados.telefono) {
        datosSanitizados.telefono = formatearTelefonoChileno(datosSanitizados.telefono);
      }

      // Enviar formulario (simulación)
      await enviarFormularioContacto(datosSanitizados);
      
      // Guardar localmente para demo
      guardarContactoLocal(datosSanitizados);

      // Mostrar éxito
      mostrarExito('✅ ¡Mensaje enviado correctamente! Te contactaremos pronto.');
      
      // Resetear formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
      setErrores({});

    } catch (error) {
      mostrarError('❌ Error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return {
    formData,
    errores,
    enviando,
    showAlert,
    alertMensaje,
    handleChange,
    handleBlur,
    handleSubmit
  };
};