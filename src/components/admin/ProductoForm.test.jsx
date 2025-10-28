import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductoForm from './ProductoForm';

describe('ProductoForm', () => {
  const mockCategorias = ['Accesorios', 'Decoración', 'Peluches'];
  const mockGetCodigoAutomatico = vi.fn(() => 'ACC001');
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    categorias: mockCategorias,
    getCodigoAutomatico: mockGetCodigoAutomatico,
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form for new product', () => {
    render(<ProductoForm {...defaultProps} />);
    
    expect(screen.getByText('Crear Producto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Llavero Stardew Valley')).toBeInTheDocument();
  });

  it('should render form for editing product', () => {
    const mockProducto = {
      codigo: 'PROD001',
      nombre: 'Producto Existente',
      descripcion: 'Descripción del producto',
      categoria: 'Accesorios',
      precio: 10000,
      stock: 50,
      stock_critico: 10,
      imagen: '/image.jpg'
    };

    render(<ProductoForm {...defaultProps} producto={mockProducto} />);
    
    expect(screen.getByDisplayValue('Producto Existente')).toBeInTheDocument();
    expect(screen.getByText('Actualizar Producto')).toBeInTheDocument();
  });

  it('should call onSubmit with form data', async () => {
    render(<ProductoForm {...defaultProps} />);
    
    // Llenar todos los campos requeridos del formulario
    const nombreInput = screen.getByPlaceholderText('Ej: Llavero Stardew Valley');
    const descripcionInput = screen.getByPlaceholderText('Descripción detallada del producto...');
    const precioInput = screen.getByPlaceholderText('5990');
    const stockInput = screen.getByPlaceholderText('50');
    const stockCriticoInput = screen.getByPlaceholderText('10');
    
    fireEvent.change(nombreInput, { target: { value: 'Nuevo Producto' } });
    fireEvent.change(descripcionInput, { target: { value: 'Descripción del nuevo producto' } });
    fireEvent.change(precioInput, { target: { value: '5990' } });
    fireEvent.change(stockInput, { target: { value: '50' } });
    fireEvent.change(stockCriticoInput, { target: { value: '10' } });
    
    // Seleccionar una categoría (ya está seleccionada por defecto 'Accesorios')
    
    const submitButton = screen.getByText('Crear Producto');
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ProductoForm {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should show validation errors for empty required fields', () => {
    render(<ProductoForm {...defaultProps} />);
    
    const submitButton = screen.getByText('Crear Producto');
    fireEvent.click(submitButton);
    
    // El formulario debería mostrar errores de validación
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});