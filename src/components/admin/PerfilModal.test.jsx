import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PerfilModal from './PerfilModal';

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

describe('PerfilModal', () => {
  const mockUsuario = {
    run: '12345678',
    nombre: 'Juan',
    apellidos: 'Pérez',
    correo: 'juan@duoc.cl',
    telefono: '912345678',
    direccion: 'Calle 123',
    comuna: 'Santiago',
    region: 'Metropolitana',
    fecha_nacimiento: '1990-01-01',
    tipo: 'Cliente'
  };

  const mockFormData = {
    nombre: 'Juan',
    apellidos: 'Pérez',
    correo: 'juan@duoc.cl',
    telefono: '912345678',
    direccion: 'Calle 123',
    comuna: 'Santiago',
    region: 'Metropolitana',
    fecha_nacimiento: '1990-01-01'
  };

  const mockOnClose = vi.fn();
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    show: true,
    usuario: mockUsuario,
    formData: mockFormData,
    guardando: false,
    onClose: mockOnClose,
    onChange: mockOnChange,
    onSubmit: mockOnSubmit
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal when show is true', () => {
    render(<PerfilModal {...defaultProps} />);
    
    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument();
  });

  it('should not render when show is false', () => {
    render(<PerfilModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Editar Perfil')).not.toBeInTheDocument();
  });

  it('should call onChange when input values change', () => {
    render(<PerfilModal {...defaultProps} />);
    
    const nombreInput = screen.getByDisplayValue('Juan');
    fireEvent.change(nombreInput, { target: { value: 'Juan Carlos' } });
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onSubmit when form is submitted', () => {
    render(<PerfilModal {...defaultProps} />);
    
    const submitButton = screen.getByText('Guardar Cambios');
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should show loading state when guardando is true', () => {
    render(<PerfilModal {...defaultProps} guardando={true} />);
    
    // Usar getAllByText para múltiples elementos
    const guardandoElements = screen.getAllByText('Guardando...');
    expect(guardandoElements).toHaveLength(2); // Debería haber 2 elementos
    
    // Verificar que el botón está deshabilitado
    const submitButton = screen.getByRole('button', { name: /guardando.../i });
    expect(submitButton).toBeDisabled();
    
    // Verificar que el spinner está presente
    const spinner = document.querySelector('.spinner-border');
    expect(spinner).toBeInTheDocument();
  });

  // Test adicional para verificar el estado normal (no loading)
  it('should show normal state when guardando is false', () => {
    render(<PerfilModal {...defaultProps} guardando={false} />);
    
    // Debería mostrar "Guardar Cambios" en lugar de "Guardando..."
    expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
    
    // No debería haber spinners visibles
    const spinner = document.querySelector('.spinner-border');
    expect(spinner).not.toBeInTheDocument();
  });
});