import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartItem from './CartItem';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('CartItem', () => {
  const mockItem = {
    codigo: 'PROD001',
    nombre: 'Producto Test',
    categoria: 'Accesorios',
    precio: 10000,
    cantidad: 2,
    stock: 10,
    stock_critico: 5,
    imagen: '/test-image.jpg'
  };

  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemove = vi.fn();

  const defaultProps = {
    item: mockItem,
    onUpdateQuantity: mockOnUpdateQuantity,
    onRemove: mockOnRemove
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify([
      { codigo: 'PROD001', stock: 8 }
    ]));
  });

  // ... otros tests iguales ...

  it('should show delete confirmation modal when remove button is clicked', () => {
    render(<CartItem {...defaultProps} />);
    
    const removeButton = screen.getByTitle('Eliminar producto');
    fireEvent.click(removeButton);
    
    // Verificar que el modal está presente usando getByRole
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    
    // Verificar contenido específico del modal
    expect(screen.getByText('¿Estás seguro de que quieres eliminar?')).toBeInTheDocument();
    expect(screen.getByText('"Producto Test"')).toBeInTheDocument();
    expect(screen.getByText('Esta acción no se puede deshacer')).toBeInTheDocument();
    
    // Verificar botones del modal
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Sí, Eliminar')).toBeInTheDocument();
  });

  // ... resto de tests iguales ...
});