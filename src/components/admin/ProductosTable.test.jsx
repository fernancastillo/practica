import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductosTable from './ProductosTable';

// Mock de formatCurrency
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => `$${value}`
}));

describe('ProductosTable', () => {
  const mockProductos = [
    {
      codigo: 'PROD001',
      nombre: 'Producto 1',
      descripcion: 'Descripción 1',
      categoria: 'Accesorios',
      precio: 10000,
      stock: 50,
      stock_critico: 10
    },
    {
      codigo: 'PROD002',
      nombre: 'Producto 2',
      descripcion: 'Descripción 2',
      categoria: 'Decoración',
      precio: 20000,
      stock: 5,
      stock_critico: 10
    }
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnGenerarReporte = vi.fn();

  const defaultProps = {
    productos: mockProductos,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onGenerarReporte: mockOnGenerarReporte
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render products table with data', () => {
    render(<ProductosTable {...defaultProps} />);
    
    expect(screen.getByText('PROD001')).toBeInTheDocument();
    expect(screen.getByText('PROD002')).toBeInTheDocument();
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('$10000')).toBeInTheDocument();
    expect(screen.getByText('$20000')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<ProductosTable {...defaultProps} />);
    
    const editButtons = screen.getAllByTitle('Editar producto');
    fireEvent.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockProductos[0]);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(<ProductosTable {...defaultProps} />);
    
    const deleteButtons = screen.getAllByTitle('Eliminar producto');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith('PROD001');
  });

  it('should show stock warning badge for critical stock', () => {
    render(<ProductosTable {...defaultProps} />);
    
    // Producto 2 tiene stock crítico (5 <= 10)
    const stockBadges = screen.getAllByText(/unidades/);
    expect(stockBadges[1]).toHaveClass('bg-warning'); // Stock crítico
  });
});