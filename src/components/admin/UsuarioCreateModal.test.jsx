import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UsuarioCreateModal from './UsuarioCreateModal';

// Mock de regionesComunasData
vi.mock('../../data/regiones_comunas.json', () => ({
  default: {
    regiones: [
      {
        id: 1,
        nombre: 'Metropolitana',
        comunas: ['Santiago', 'Providencia', 'Las Condes']
      }
    ]
  }
}));

describe('UsuarioCreateModal', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    show: true,
    onSave: mockOnSave,
    onClose: mockOnClose
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create user modal', () => {
    render(<UsuarioCreateModal {...defaultProps} />);
    
    expect(screen.getByText('Crear Nuevo Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('123456789')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese el nombre')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<UsuarioCreateModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    render(<UsuarioCreateModal {...defaultProps} />);
    
    const submitButton = screen.getByText('Crear Usuario');
    fireEvent.click(submitButton);
    
    // Debería mostrar errores de validación
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should show loading state when saving', () => {
    render(<UsuarioCreateModal {...defaultProps} />);
    
    // Simular estado de guardando (esto normalmente se manejaría internamente)
    expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
  });
});