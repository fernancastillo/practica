import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrdenModal from './OrdenModal';

// Mocks (igual que arriba)
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => `$${value}`,
  formatDate: (date) => '2024-01-01',
  getEstadoBadge: (estado) => 'bg-warning'
}));

vi.mock('../../utils/admin/boletaUtils', () => ({
  generarBoletaOrden: vi.fn(),
  generarBoletaCSV: vi.fn(),
  generarBoletaTexto: vi.fn()
}));

describe('OrdenModal', () => {
  const mockOrden = {
    numeroOrden: 'SO1001',
    fecha: '2024-01-01',
    run: '12345678',
    total: 25000,
    estadoEnvio: 'Pendiente',
    productos: [
      {
        codigo: 'PROD001',
        nombre: 'Producto Test',
        precio: 10000,
        cantidad: 2
      }
    ]
  };

  const mockOnClose = vi.fn();
  const mockOnUpdateEstado = vi.fn();

  const defaultProps = {
    show: true,
    orden: mockOrden,
    onClose: mockOnClose,
    onUpdateEstado: mockOnUpdateEstado
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
  });

  it('should render order details when show is true', () => {
    render(<OrdenModal {...defaultProps} />);
    
    // Verificar elementos únicos primero
    expect(screen.getByText('Detalles de Orden:')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
    
    // Para elementos duplicados, verificar contexto o usar getAllByText
    const orderNumberInTitle = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'span' && 
             element.classList.contains('text-primary') && 
             content === 'SO1001';
    });
    expect(orderNumberInTitle).toBeInTheDocument();
    
    // Verificar que hay al menos un elemento con $25000
    const totalElements = screen.getAllByText('$25000');
    expect(totalElements.length).toBeGreaterThan(0);
  });

  it('should not render when show is false', () => {
    render(<OrdenModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Detalles de Orden:')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<OrdenModal {...defaultProps} />);
    
    // Buscar el botón de cerrar por su clase específica
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(button => 
      button.classList.contains('btn-close')
    );
    
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when Cerrar button in footer is clicked', () => {
    render(<OrdenModal {...defaultProps} />);
    
    const cerrarButton = screen.getByText('Cerrar');
    fireEvent.click(cerrarButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onUpdateEstado when status button is clicked', () => {
    render(<OrdenModal {...defaultProps} />);
    
    const enviadoButton = screen.getByText('Marcar como Enviado');
    fireEvent.click(enviadoButton);
    
    expect(mockOnUpdateEstado).toHaveBeenCalledWith('SO1001', 'Enviado');
  });

  it('should show format selector when download button is clicked', () => {
    render(<OrdenModal {...defaultProps} />);
    
    const downloadButton = screen.getByText('Descargar Boleta');
    fireEvent.click(downloadButton);
    
    expect(screen.getByText('Formato de Boleta')).toBeInTheDocument();
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('Texto Plano')).toBeInTheDocument();
  });

  it('should render all product information correctly', () => {
    render(<OrdenModal {...defaultProps} />);
    
    // Verificar información de productos en la tabla
    expect(screen.getByText('PROD001')).toBeInTheDocument();
    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    
    // La cantidad está en un badge
    const cantidadBadge = screen.getByText('2');
    expect(cantidadBadge).toHaveClass('badge', 'bg-primary');
    
    // Precios
    expect(screen.getByText('$10000')).toBeInTheDocument();
    expect(screen.getByText('$20000')).toBeInTheDocument();
  });

  it('should render order status information', () => {
    render(<OrdenModal {...defaultProps} />);
    
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Marcar como Enviado')).toBeInTheDocument();
    expect(screen.getByText('Marcar como Entregado')).toBeInTheDocument();
    expect(screen.getByText('Marcar como Cancelado')).toBeInTheDocument();
  });
});