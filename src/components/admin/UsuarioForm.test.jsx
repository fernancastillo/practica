import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UsuarioForm from './UsuarioForm';

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

describe('UsuarioForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel
  };

  const fillRequiredFields = () => {
    // Llenar RUN (campo requerido)
    const runInput = screen.getByPlaceholderText('Ej: 123456789');
    fireEvent.change(runInput, { target: { value: '123456789' } });
    
    // Llenar nombre (campo requerido)
    const nombreInput = screen.getByPlaceholderText('Ej: Ana María');
    fireEvent.change(nombreInput, { target: { value: 'Juan' } });
    
    // Llenar apellidos (campo requerido)
    const apellidosInput = screen.getByPlaceholderText('Ej: González Pérez');
    fireEvent.change(apellidosInput, { target: { value: 'Pérez González' } });
    
    // Llenar email (campo requerido)
    const emailInput = screen.getByPlaceholderText('Ej: usuario@gmail.com');
    fireEvent.change(emailInput, { target: { value: 'juan@duoc.cl' } });
    
    // Llenar fecha de nacimiento (campo requerido)
    const fechaInput = screen.getByLabelText('Fecha de Nacimiento *');
    fireEvent.change(fechaInput, { target: { value: '1990-01-01' } });
    
    // Llenar dirección (campo requerido)
    const direccionInput = screen.getByPlaceholderText('Ej: Av. Principal 123');
    fireEvent.change(direccionInput, { target: { value: 'Calle Principal 123' } });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form for new user', () => {
    render(<UsuarioForm {...defaultProps} />);
    
    expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: 123456789')).toBeInTheDocument();
  });

  it('should render form for editing user', () => {
    const mockUsuario = {
      run: '12345678',
      nombre: 'Juan',
      apellidos: 'Pérez',
      correo: 'juan@duoc.cl',
      telefono: '912345678',
      direccion: 'Calle 123',
      comuna: 'Santiago',
      region: 'Metropolitana',
      tipo: 'Cliente',
      fecha_nacimiento: '1990-01-01'
    };

    render(<UsuarioForm {...defaultProps} usuario={mockUsuario} />);
    
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    expect(screen.getByText('Actualizar Usuario')).toBeInTheDocument();
  });

  it('should call onSubmit with form data', () => {
    render(<UsuarioForm {...defaultProps} />);
    
    // Llenar todos los campos requeridos
    fillRequiredFields();
    
    const submitButton = screen.getByText('Crear Usuario');
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<UsuarioForm {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  // Test adicional para verificar validación
  it('should not call onSubmit when required fields are empty', () => {
    render(<UsuarioForm {...defaultProps} />);
    
    // Hacer clic en enviar sin llenar campos
    const submitButton = screen.getByText('Crear Usuario');
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});