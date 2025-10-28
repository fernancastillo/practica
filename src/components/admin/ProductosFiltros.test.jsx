import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductosFiltros from './ProductosFiltros';

describe('ProductosFiltros', () => {
  const mockFiltros = {
    codigo: '',
    nombre: '',
    categoria: '',
    estadoStock: '',
    precioMin: '',
    precioMax: '',
    stockMin: '',
    ordenarPor: 'nombre'
  };

  const mockOnFiltroChange = vi.fn();
  const mockOnLimpiarFiltros = vi.fn();
  const mockCategorias = ['Accesorios', 'Decoración', 'Peluches'];

  const defaultProps = {
    filtros: mockFiltros,
    onFiltroChange: mockOnFiltroChange,
    onLimpiarFiltros: mockOnLimpiarFiltros,
    resultados: { filtrados: 15, totales: 45 },
    categorias: mockCategorias
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all filter inputs', () => {
    render(<ProductosFiltros {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Ej: PROD001')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Laptop Gamer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Todas las categorías')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Todos los estados')).toBeInTheDocument();
  });

  it('should call onFiltroChange when input changes', () => {
    render(<ProductosFiltros {...defaultProps} />);
    
    const codigoInput = screen.getByPlaceholderText('Ej: PROD001');
    fireEvent.change(codigoInput, { target: { value: 'PROD001' } });
    
    expect(mockOnFiltroChange).toHaveBeenCalled();
  });

  it('should display results count', () => {
    render(<ProductosFiltros {...defaultProps} />);
    
    expect(screen.getByText('15 de 45 productos encontrados')).toBeInTheDocument();
  });
});