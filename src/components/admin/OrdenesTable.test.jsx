import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrdenesTable from './OrdenesTable';

// Mock de las utilidades
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => `$${value}`,
  formatDate: (date) => '2024-01-01'
}));

describe('OrdenesTable', () => {
  const mockOrdenes = [
    {
      numeroOrden: 'SO1001',
      fecha: '2024-01-01',
      run: '12345678',
      total: 25000,
      estadoEnvio: 'Pendiente',
      productos: [
        { codigo: 'PROD001', nombre: 'Producto 1', precio: 10000, cantidad: 1 }
      ]
    },
    {
      numeroOrden: 'SO1002',
      fecha: '2024-01-02',
      run: '87654321',
      total: 15000,
      estadoEnvio: 'Entregado',
      productos: [
        { codigo: 'PROD002', nombre: 'Producto 2', precio: 15000, cantidad: 1 }
      ]
    }
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnUpdateEstado = vi.fn();

  const defaultProps = {
    ordenes: mockOrdenes,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onUpdateEstado: mockOnUpdateEstado
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn();
  });

  it('should render orders table with data', () => {
    render(<OrdenesTable {...defaultProps} />);
    
    expect(screen.getByText('SO1001')).toBeInTheDocument();
    expect(screen.getByText('SO1002')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('$25000')).toBeInTheDocument();
    expect(screen.getByText('$15000')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<OrdenesTable {...defaultProps} />);
    
    const editButtons = screen.getAllByTitle('Ver detalles y cambiar estado');
    fireEvent.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockOrdenes[0]);
  });

  it('should show delete button for non-delivered orders', () => {
    render(<OrdenesTable {...defaultProps} />);
    
    const deleteButtons = screen.getAllByTitle('Eliminar orden');
    expect(deleteButtons[0]).not.toBeDisabled(); // Pendiente - habilitado
    expect(deleteButtons[1]).toBeDisabled(); // Entregado - deshabilitado
  });

  it('should handle empty orders', () => {
    render(<OrdenesTable {...defaultProps} ordenes={[]} />);
    
    expect(screen.getByText('No se encontraron órdenes')).toBeInTheDocument();
  });
});