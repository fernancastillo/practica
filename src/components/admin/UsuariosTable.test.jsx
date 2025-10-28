import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UsuariosTable from './UsuariosTable';

// Mock de las utilidades
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => `$${value}`,
  formatDate: (date) => '01/01/2024'
}));

describe('UsuariosTable', () => {
  const mockUsuarios = [
    {
      run: '12345678',
      nombre: 'Juan',
      apellidos: 'Pérez',
      correo: 'juan@duoc.cl',
      telefono: '912345678',
      direccion: 'Calle 123',
      tipo: 'Cliente',
      totalCompras: 5,
      totalGastado: 125000
    },
    {
      run: '87654321',
      nombre: 'Admin',
      apellidos: 'Sistema',
      correo: 'admin@duoc.cl',
      telefono: '987654321',
      direccion: 'Oficina 1',
      tipo: 'Admin',
      totalCompras: 0,
      totalGastado: 0
    }
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const defaultProps = {
    usuarios: mockUsuarios,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
  });

  it('should render users table with data', () => {
    render(<UsuariosTable {...defaultProps} />);
    
    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('87654321')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Admin Sistema')).toBeInTheDocument();
  });

  it('should call onEdit for non-admin users', () => {
    render(<UsuariosTable {...defaultProps} />);
    
    const editButtons = screen.getAllByTitle('Editar usuario');
    fireEvent.click(editButtons[0]); // Cliente - debería funcionar
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockUsuarios[0]);
  });

  it('should not allow editing admin users', () => {
    render(<UsuariosTable {...defaultProps} />);
    
    // El segundo usuario es admin, no debería tener botones de edición/eliminación
    expect(screen.getByText('Protegido')).toBeInTheDocument();
    expect(screen.getByText('No editable')).toBeInTheDocument();
  });

  it('should call onDelete for non-admin users with confirmation', () => {
    render(<UsuariosTable {...defaultProps} />);
    
    const deleteButtons = screen.getAllByTitle('Eliminar usuario');
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('should handle empty users list', () => {
    render(<UsuariosTable {...defaultProps} usuarios={[]} />);
    
    expect(screen.getByText('No se encontraron usuarios')).toBeInTheDocument();
  });
});