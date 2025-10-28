import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReporteModal from './ReporteModal';

// Mock de formatCurrency
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => `$${value}`
}));

describe('ReporteModal', () => {
  const mockEstadisticas = {
    totalOrdenes: 100,
    pendientes: 15,
    enviadas: 25,
    entregadas: 55,
    canceladas: 5,
    ingresosTotales: 2500000
  };

  const mockOnSeleccionarFormato = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    show: true,
    estadisticas: mockEstadisticas,
    tipo: 'ordenes',
    onSeleccionarFormato: mockOnSeleccionarFormato,
    onClose: mockOnClose
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render report modal for orders', () => {
    render(<ReporteModal {...defaultProps} />);
    
    expect(screen.getByText('Estadísticas del Reporte - Órdenes')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('$2500000')).toBeInTheDocument();
  });

  it('should render report modal for users', () => {
    const userStats = {
      totalUsuarios: 50,
      totalClientes: 45,
      totalAdmins: 5,
      usuariosConCompras: 30
    };
    
    render(<ReporteModal {...defaultProps} tipo="usuarios" estadisticas={userStats} />);
    
    expect(screen.getByText('Estadísticas del Reporte - Usuarios')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should call onSeleccionarFormato when format is selected', () => {
    render(<ReporteModal {...defaultProps} />);
    
    // Encontrar el card correcto por su contenido específico
    const csvCards = screen.getAllByText('CSV Estándar');
    // El primer elemento debería ser el h6 dentro del card clickeable
    const csvCard = csvCards[0].closest('.card');
    
    expect(csvCard).toBeInTheDocument();
    fireEvent.click(csvCard);
    
    expect(mockOnSeleccionarFormato).toHaveBeenCalledWith('csv');
  });

  it('should call onSeleccionarFormato for Excel format when clicked', () => {
    render(<ReporteModal {...defaultProps} />);
    
    // Encontrar el card de Excel
    const excelCards = screen.getAllByText('CSV para Excel');
    const excelCard = excelCards[0].closest('.card');
    
    expect(excelCard).toBeInTheDocument();
    fireEvent.click(excelCard);
    
    expect(mockOnSeleccionarFormato).toHaveBeenCalledWith('csv-excel');
  });

  it('should call onClose when close button is clicked', () => {
    render(<ReporteModal {...defaultProps} />);
    
    const closeButton = screen.getByText('Cancelar');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});