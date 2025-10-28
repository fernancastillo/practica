// src/utils/tienda/registroValidaciones.test.js
import { describe, it, expect } from 'vitest';
import { registroValidaciones } from './registroValidaciones.js';

describe('registroValidaciones', () => {
  describe('validarNombre', () => {
    it('valida nombre correcto', () => {
      expect(registroValidaciones.validarNombre('Juan')).toBe(true);
      expect(registroValidaciones.validarNombre('María José')).toBe(true);
      expect(registroValidaciones.validarNombre('Ángel')).toBe(true);
    });

    it('rechaza nombre incorrecto', () => {
      expect(registroValidaciones.validarNombre('Jo')).toBe(false);
      expect(registroValidaciones.validarNombre('Juan123')).toBe(false);
      expect(registroValidaciones.validarNombre('Juan@Pérez')).toBe(false);
    });
  });

  describe('validarApellido', () => {
    it('valida apellido correcto', () => {
      expect(registroValidaciones.validarApellido('Pérez')).toBe(true);
      expect(registroValidaciones.validarApellido('González López')).toBe(true);
    });

    it('rechaza apellido incorrecto', () => {
      expect(registroValidaciones.validarApellido('Pe')).toBe(false);
      expect(registroValidaciones.validarApellido('Pérez123')).toBe(false);
    });
  });

  describe('validarRUN', () => {
    it('valida RUN con formato correcto', () => {
      // RUN válido según algoritmo módulo 11: 12.345.678-5
      const result = registroValidaciones.validarRUN('123456785');
      expect(result.valido).toBe(true);
    });

    it('rechaza RUN con formato incorrecto', () => {
      const result = registroValidaciones.validarRUN('12345678A');
      expect(result.valido).toBe(false);
      expect(result.mensaje).toContain('8-9 dígitos');
    });

    it('rechaza RUN muy corto', () => {
      const result = registroValidaciones.validarRUN('1234567');
      expect(result.valido).toBe(false);
    });
  });

  
  describe('validarEmail', () => {
    it('valida email correcto', () => {
      const result = registroValidaciones.validarEmail('test@example.com');
      expect(result.valido).toBe(true);
      expect(result.esDuoc).toBe(false);
    });

    it('valida email DUOC', () => {
      const result1 = registroValidaciones.validarEmail('alumno@duoc.cl');
      expect(result1.valido).toBe(true);
      expect(result1.esDuoc).toBe(true);

      const result2 = registroValidaciones.validarEmail('profesor@duocuc.cl');
      expect(result2.valido).toBe(true);
      expect(result2.esDuoc).toBe(true);
    });

    it('rechaza email incorrecto', () => {
      const result = registroValidaciones.validarEmail('invalid-email');
      expect(result.valido).toBe(false);
    });
  });

  describe('validarFono', () => {
    it('valida teléfono correcto', () => {
      expect(registroValidaciones.validarFono('912345678')).toBe(true);
    });

    it('valida teléfono vacío (opcional)', () => {
      expect(registroValidaciones.validarFono('')).toBe(true);
      expect(registroValidaciones.validarFono(null)).toBe(true);
    });

    it('rechaza teléfono incorrecto', () => {
      expect(registroValidaciones.validarFono('812345678')).toBe(false);
      expect(registroValidaciones.validarFono('91234567')).toBe(false);
      expect(registroValidaciones.validarFono('9123456789')).toBe(false);
    });
  });

  describe('validarPassword', () => {
    it('valida contraseña correcta', () => {
      expect(registroValidaciones.validarPassword('1234')).toBe(true);
      expect(registroValidaciones.validarPassword('1234567890')).toBe(true);
      expect(registroValidaciones.validarPassword('abcd')).toBe(true);
    });

    it('rechaza contraseña incorrecta', () => {
      expect(registroValidaciones.validarPassword('123')).toBe(false);
      expect(registroValidaciones.validarPassword('12345678901')).toBe(false);
    });
  });

  describe('validarConfirmarPassword', () => {
    it('valida contraseñas coincidentes', () => {
      expect(registroValidaciones.validarConfirmarPassword('1234', '1234')).toBe(true);
    });

    it('rechaza contraseñas diferentes', () => {
      expect(registroValidaciones.validarConfirmarPassword('1234', '1235')).toBe(false);
    });
  });

  describe('validarEdad', () => {
    it('calcula edad correctamente', () => {
      const hoy = new Date();
      const fechaNacimiento = new Date(hoy.getFullYear() - 20, hoy.getMonth(), hoy.getDate());
      
      const edad = registroValidaciones.validarEdad(fechaNacimiento.toISOString().split('T')[0]);
      
      expect(edad).toBe(20);
    });

    it('calcula edad correctamente antes del cumpleaños', () => {
      const hoy = new Date();
      const fechaNacimiento = new Date(hoy.getFullYear() - 20, hoy.getMonth() + 1, hoy.getDate());
      
      const edad = registroValidaciones.validarEdad(fechaNacimiento.toISOString().split('T')[0]);
      
      expect(edad).toBe(19);
    });
  });

  describe('validarFormularioCompleto', () => {
    it('valida formulario completo correcto', () => {
      const formData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        run: '123456785', // RUN válido
        email: 'juan@test.com',
        fono: '912345678',
        direccion: 'Calle Falsa 123',
        comuna: 'Santiago',
        region: '13',
        password: '1234',
        confirmarPassword: '1234',
        fechaNacimiento: '1990-01-01'
      };

      const result = registroValidaciones.validarFormularioCompleto(formData);

      expect(result.esValido).toBe(true);
      expect(result.errores).toEqual({});
    });

    it('detecta múltiples errores en formulario', () => {
      const formData = {
        nombre: 'Jo',
        apellido: 'Pe',
        run: '123',
        email: 'invalid-email',
        fono: '812345678',
        direccion: 'C',
        comuna: '',
        region: '',
        password: '123',
        confirmarPassword: '124',
        fechaNacimiento: ''
      };

      const result = registroValidaciones.validarFormularioCompleto(formData);

      expect(result.esValido).toBe(false);
      expect(result.errores).toHaveProperty('nombre');
      expect(result.errores).toHaveProperty('apellido');
      expect(result.errores).toHaveProperty('run');
      expect(result.errores).toHaveProperty('email');
      expect(result.errores).toHaveProperty('fono');
      expect(result.errores).toHaveProperty('direccion');
      expect(result.errores).toHaveProperty('comuna');
      expect(result.errores).toHaveProperty('region');
      expect(result.errores).toHaveProperty('password');
      expect(result.errores).toHaveProperty('confirmarPassword');
      expect(result.errores).toHaveProperty('fechaNacimiento');
    });

    it('valida teléfono opcional correctamente', () => {
      const formData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        run: '123456785',
        email: 'juan@test.com',
        fono: '',
        direccion: 'Calle Falsa 123',
        comuna: 'Santiago',
        region: '13',
        password: '1234',
        confirmarPassword: '1234',
        fechaNacimiento: '1990-01-01'
      };

      const result = registroValidaciones.validarFormularioCompleto(formData);

      expect(result.esValido).toBe(true);
      expect(result.errores).not.toHaveProperty('fono');
    });

    it('rechaza edad menor a 10 años', () => {
      const hoy = new Date();
      const fechaNacimiento = new Date(hoy.getFullYear() - 9, hoy.getMonth(), hoy.getDate());
      
      const formData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        run: '123456785',
        email: 'juan@test.com',
        fono: '912345678',
        direccion: 'Calle Falsa 123',
        comuna: 'Santiago',
        region: '13',
        password: '1234',
        confirmarPassword: '1234',
        fechaNacimiento: fechaNacimiento.toISOString().split('T')[0]
      };

      const result = registroValidaciones.validarFormularioCompleto(formData);

      expect(result.esValido).toBe(false);
      expect(result.errores).toHaveProperty('fechaNacimiento');
      expect(result.errores.fechaNacimiento).toContain('10 años');
    });
  });
});