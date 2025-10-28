// src/utils/tienda/stockService.simple.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getProductosConStockActual, 
  verificarStockDisponible 
} from './stockService.js';

describe('stockService - Simple', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock básico de localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn()
      },
      writable: true
    });
  });

  it('calcula stock disponible correctamente', () => {
    // Mock de datos
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'app_productos') {
        return JSON.stringify([{ codigo: 'P1', nombre: 'Producto', stock: 10 }]);
      }
      if (key === 'junimoCart') {
        return JSON.stringify([{ codigo: 'P1', cantidad: 3 }]);
      }
      return null;
    });

    const result = getProductosConStockActual();

    expect(result[0].stock_disponible).toBe(7); // 10 - 3
  });

  it('verifica stock disponible correctamente', () => {
    // Mock de datos
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'app_productos') {
        return JSON.stringify([{ codigo: 'P1', nombre: 'Producto', stock: 10 }]);
      }
      if (key === 'junimoCart') {
        return JSON.stringify([{ codigo: 'P1', cantidad: 3 }]);
      }
      return null;
    });

    const tieneStock = verificarStockDisponible('P1', 5); // Queremos 5, hay 7 disponibles
    const noTieneStock = verificarStockDisponible('P1', 8); // Queremos 8, hay 7 disponibles

    expect(tieneStock).toBe(true);
    expect(noTieneStock).toBe(false);
  });
});