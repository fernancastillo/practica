// src/utils/tienda/paymentService.simple.test.js
import { describe, it, expect } from 'vitest';
import { paymentService } from './paymentService.js';

describe('paymentService - Simple', () => {
  it('valida número de tarjeta correcto', () => {
    const result = paymentService.validateCardNumber('4111111111111111');
    expect(result.isValid).toBe(true);
  });

  it('valida número de tarjeta incorrecto', () => {
    const result = paymentService.validateCardNumber('4111111111111112');
    expect(result.isValid).toBe(false);
  });

  it('valida CVV correcto', () => {
    const result = paymentService.validateCVV('123');
    expect(result.isValid).toBe(true);
  });

  it('formatea número de tarjeta', () => {
    const result = paymentService.formatCardNumber('4111111111111111');
    expect(result).toBe('4111 1111 1111 1111');
  });
});