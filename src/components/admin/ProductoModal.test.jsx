import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductoModal from './ProductoModal';

// Mock del componente ProductoForm
vi.mock('./ProductoForm', () => {
  return {
    default: vi.fn(({ onSubmit, onCancel }) => (
      <div>
        <button onClick={() => onSubmit({ nombre: 'Test Product' })}>Submit</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ))
  };
});

describe('ProductoModal', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    show: true,
    categorias: ['Accesorios', 'Decoración'],
    getCodigoAutomatico: vi.fn(),
    onSave: mockOnSave,
    onClose: mockOnClose
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal when show is true', () => {
    render(<ProductoModal {...defaultProps} />);
    
    expect(screen.getByText('Agregar Nuevo Producto')).toBeInTheDocument();
  });

  it('should not render when show is false', () => {
    render(<ProductoModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Agregar Nuevo Producto')).not.toBeInTheDocument();
  });

  it('should render edit title when producto is provided', () => {
    const mockProducto = { codigo: 'PROD001', nombre: 'Producto Test' };
    render(<ProductoModal {...defaultProps} producto={mockProducto} />);
    
    expect(screen.getByText('Editar Producto')).toBeInTheDocument();
  });
});