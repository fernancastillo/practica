// src/utils/tienda/authService.ultra-minimal.test.js
import { describe, it, expect, vi } from 'vitest';
import { authService } from './authService.js';

// Mock muy simple
vi.mock('../localstorageHelper', () => ({
  saveLocalstorage: vi.fn(),
  loadFromLocalstorage: vi.fn(),
  deleteFromLocalstorage: vi.fn()
}));

describe('authService - Ultra Minimal', () => {
  it('puede importar el servicio', () => {
    expect(authService).toBeDefined();
    expect(typeof authService.login).toBe('function');
  });

  it('tiene método isAuthenticated', () => {
    expect(typeof authService.isAuthenticated).toBe('function');
  });
});