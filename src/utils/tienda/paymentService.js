// src/utils/tienda/paymentService.js
export const paymentService = {
  // ✅ VALIDAR NÚMERO DE TARJETA CON ALGORITMO DE LUHN
  validateCardNumber: (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (!/^\d{16}$/.test(cleaned)) {
      return { isValid: false, error: 'El número de tarjeta debe tener 16 dígitos' };
    }

    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    const isValid = sum % 10 === 0;
    return {
      isValid,
      error: isValid ? null : 'Número de tarjeta inválido'
    };
  },

  // ✅ VALIDAR FECHA DE EXPIRACIÓN
  validateExpiryDate: (expiryDate) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    
    if (!expiryDate.trim()) {
      return { isValid: false, error: 'La fecha de expiración es requerida' };
    }

    if (!regex.test(expiryDate)) {
      return { isValid: false, error: 'Formato inválido (MM/YY)' };
    }

    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    // Agregar un mes de gracia
    const gracePeriod = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (expiry < gracePeriod) {
      return { isValid: false, error: 'La tarjeta está vencida' };
    }

    return { isValid: true, error: null };
  },

  // ✅ VALIDAR CVV
  validateCVV: (cvv) => {
    const regex = /^\d{3,4}$/;
    
    if (!cvv.trim()) {
      return { isValid: false, error: 'El CVV es requerido' };
    }

    if (!regex.test(cvv)) {
      return { isValid: false, error: 'El CVV debe tener 3 o 4 dígitos' };
    }

    return { isValid: true, error: null };
  },

  // ✅ VALIDAR NOMBRE EN TARJETA
  validateCardName: (name) => {
    if (!name.trim()) {
      return { isValid: false, error: 'El nombre en la tarjeta es requerido' };
    }

    if (name.trim().length < 3) {
      return { isValid: false, error: 'El nombre debe tener al menos 3 caracteres' };
    }

    // Validar que solo contenga letras y espacios
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return { isValid: false, error: 'El nombre solo puede contener letras y espacios' };
    }

    return { isValid: true, error: null };
  },

  // ✅ VALIDAR TODOS LOS DATOS DE LA TARJETA
  validateCreditCard: (cardData) => {
    const errors = {};
    
    const cardNumberValidation = paymentService.validateCardNumber(cardData.cardNumber);
    if (!cardNumberValidation.isValid) {
      errors.cardNumber = cardNumberValidation.error;
    }
    
    const cardNameValidation = paymentService.validateCardName(cardData.cardName);
    if (!cardNameValidation.isValid) {
      errors.cardName = cardNameValidation.error;
    }
    
    const expiryValidation = paymentService.validateExpiryDate(cardData.expiryDate);
    if (!expiryValidation.isValid) {
      errors.expiryDate = expiryValidation.error;
    }
    
    const cvvValidation = paymentService.validateCVV(cardData.cvv);
    if (!cvvValidation.isValid) {
      errors.cvv = cvvValidation.error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // ✅ FORMATEAR NÚMERO DE TARJETA (XXXX XXXX XXXX XXXX)
  formatCardNumber: (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  },

  // ✅ FORMATEAR FECHA DE EXPIRACIÓN (MM/YY)
  formatExpiryDate: (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  },

  // ✅ DETECTAR TIPO DE TARJETA
  detectCardType: (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    
    const cardPatterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      diners: /^3(?:0[0-5]|[68])/,
      discover: /^6(?:011|5)/
    };

    for (const [type, pattern] of Object.entries(cardPatterns)) {
      if (pattern.test(cleaned)) {
        return type;
      }
    }

    return 'unknown';
  },

  // ✅ SIMULAR PROCESAMIENTO DE PAGO
  processPayment: async (cardData, amount) => {
    // Simular delay de procesamiento (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Siempre retorna éxito
    return {
      success: true,
      transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      message: 'Pago procesado exitosamente',
      timestamp: new Date().toISOString()
    };
  }
};

export default paymentService;