import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UsuarioModal from './UsuarioModal';

// Mocks
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => `$${value}`,
  formatDate: (date) => '01/01/2024'
}));

vi.mock('../../utils/dataService', () => ({
  dataService: {
    getOrdenesPorUsuario: vi.fn(() => [])
  }
}));

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

describe('UsuarioModal', () => {
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
    fecha_nacimiento: '1990-01-01',
    totalCompras: 5,
    totalGastado: 125000
  };

  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();

  const defaultProps = {
    show: true,
    usuario: mockUsuario,
    onClose: mockOnClose,
    onUpdate: mockOnUpdate
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user details modal', () => {
    render(<UsuarioModal {...defaultProps} />);
    
    expect(screen.getByText('Detalles de Usuario:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<UsuarioModal {...defaultProps} />);
    
    const closeButton = screen.getByText('Cerrar');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onUpdate when form is submitted', () => {
    render(<UsuarioModal {...defaultProps} />);
    
    const saveButton = screen.getByText('Guardar Cambios');
    fireEvent.click(saveButton);
    
    expect(mockOnUpdate).toHaveBeenCalled();
  });

  it('should show purchase history for clients', () => {
    render(<UsuarioModal {...defaultProps} />);
    
    expect(screen.getByText('Historial de Órdenes')).toBeInTheDocument();
  });
});