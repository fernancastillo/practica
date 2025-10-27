import { useState } from 'react';
import { contactService } from './contactService';

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const validationErrors = contactService.validateContactForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await contactService.submitContactForm(formData);
      
      setAlertMessage(result.message);
      setAlertVariant('success');
      setShowAlert(true);
      
      if (result.success) {
        // Resetear formulario
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          asunto: '',
          mensaje: ''
        });
        setErrors({});
      }
      
    } catch (error) {
      setAlertMessage('Error al enviar el formulario. Por favor, intenta nuevamente.');
      setAlertVariant('danger');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  const clearForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    });
    setErrors({});
    setShowAlert(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    showAlert,
    alertMessage,
    alertVariant,
    handleInputChange,
    handleSubmit,
    clearForm
  };
};