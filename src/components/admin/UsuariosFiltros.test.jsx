import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UsuariosFiltros from './UsuariosFiltros';

describe('UsuariosFiltros', () => {
  const mockFiltros = {
    run: '',
    nombre: '',
    email: '',
    tipo: ''
  };

  const mockOnFiltroChange = vi.fn();
  const mockOnLimpiarFiltros = vi.fn();

  const defaultProps = {
    filtros: mockFiltros,
    onFiltroChange: mockOnFiltroChange,
    onLimpiarFiltros: mockOnLimpiarFiltros,
    resultados: { filtrados: 20, totales: 50 }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all filter inputs', () => {
    render(<UsuariosFiltros {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Ej: 20694795')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Ana González')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: usuario@email.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Todos los tipos')).toBeInTheDocument();
  });

  it('should call onFiltroChange when input changes', () => {
    render(<UsuariosFiltros {...defaultProps} />);
    
    const runInput = screen.getByPlaceholderText('Ej: 20694795');
    fireEvent.change(runInput, { target: { value: '12345678' } });
    
    expect(mockOnFiltroChange).toHaveBeenCalled();
  });

  it('should display results count', () => {
    render(<UsuariosFiltros {...defaultProps} />);
    
    expect(screen.getByText('20 de 50 usuarios encontrados')).toBeInTheDocument();
  });
});
