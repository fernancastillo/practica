import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import OrdenesFiltros from './OrdenesFiltros';

describe('OrdenesFiltros', () => {
  const mockFiltros = {
    numeroOrden: '',
    run: '',
    estado: '',
    fecha: ''
  };

  const mockOnFiltroChange = vi.fn();
  const mockOnLimpiarFiltros = vi.fn();

  const defaultProps = {
    filtros: mockFiltros,
    onFiltroChange: mockOnFiltroChange,
    onLimpiarFiltros: mockOnLimpiarFiltros,
    resultados: { filtradas: 10, totales: 50 }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all filter inputs', () => {
    render(<OrdenesFiltros {...defaultProps} />);
    
    // Verificar que el componente principal se renderiza
    expect(screen.getByText('Filtros de Búsqueda')).toBeInTheDocument();
    
    // Verificar inputs específicos por sus propiedades
    expect(screen.getByPlaceholderText('Ej: SO1001')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: 20694795')).toBeInTheDocument();
    
    // Verificar el select de estado
    const estadoSelect = screen.getByDisplayValue('Todos los estados');
    expect(estadoSelect).toBeInTheDocument();
    expect(estadoSelect).toHaveAttribute('name', 'estado');
    
    // Verificar el input de fecha por su tipo y nombre
    const fechaInput = document.querySelector('input[type="date"][name="fecha"]');
    expect(fechaInput).toBeInTheDocument();
  });

  // ... los otros tests se mantienen igual
  it('should call onFiltroChange when input changes', () => {
    render(<OrdenesFiltros {...defaultProps} />);
    
    const numeroOrdenInput = screen.getByPlaceholderText('Ej: SO1001');
    fireEvent.change(numeroOrdenInput, { target: { value: 'SO1001' } });
    
    expect(mockOnFiltroChange).toHaveBeenCalled();
  });

  it('should call onLimpiarFiltros when clear button is clicked', () => {
    render(<OrdenesFiltros {...defaultProps} />);
    
    const clearButton = screen.getByText('Limpiar Filtros');
    fireEvent.click(clearButton);
    
    expect(mockOnLimpiarFiltros).toHaveBeenCalled();
  });

  it('should display results count', () => {
    render(<OrdenesFiltros {...defaultProps} />);
    
    expect(screen.getByText('10 de 50 órdenes encontradas')).toBeInTheDocument();
  });
});