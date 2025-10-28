import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrdenesStats from './OrdenesStats';

// Mock de formatCurrency - CORREGIDO para usar formato chileno
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => {
    // Simular formato chileno con puntos como separadores de miles
    if (value === 2500000) return '$2.500.000';
    if (value === 0) return '$0';
    return `$${value}`;
  }
}));

describe('OrdenesStats', () => {
  const mockEstadisticas = {
    totalOrdenes: 100,
    pendientes: 15,
    enviadas: 25,
    entregadas: 55,
    canceladas: 5,
    ingresosTotales: 2500000
  };

  it('should render all order statistics', () => {
    render(<OrdenesStats estadisticas={mockEstadisticas} />);
    
    // Usar queries más específicas para evitar conflictos
    const statValues = screen.getAllByRole('generic', { 
      name: (content, element) => 
        element.classList.contains('h5') && 
        element.classList.contains('mb-0') &&
        element.classList.contains('font-weight-bold') &&
        element.classList.contains('text-gray-800')
    });
    
    // Verificar que tenemos 6 elementos de estadísticas
    expect(statValues).toHaveLength(6);
    
    // Verificar los valores en orden
    expect(statValues[0]).toHaveTextContent('100');
    expect(statValues[1]).toHaveTextContent('15');
    expect(statValues[2]).toHaveTextContent('25');
    expect(statValues[3]).toHaveTextContent('55');
    expect(statValues[4]).toHaveTextContent('5');
    expect(statValues[5]).toHaveTextContent('$2.500.000'); // CORREGIDO: formato chileno
  });

  it('should render correct titles', () => {
    render(<OrdenesStats estadisticas={mockEstadisticas} />);
    
    expect(screen.getByText('Total Órdenes')).toBeInTheDocument();
    expect(screen.getByText('Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Enviadas')).toBeInTheDocument();
    expect(screen.getByText('Entregadas')).toBeInTheDocument();
    expect(screen.getByText('Canceladas')).toBeInTheDocument();
    expect(screen.getByText('Ingresos Totales')).toBeInTheDocument();
  });

  it('should handle empty statistics', () => {
    const emptyStats = {
      totalOrdenes: 0,
      pendientes: 0,
      enviadas: 0,
      entregadas: 0,
      canceladas: 0,
      ingresosTotales: 0
    };
    
    render(<OrdenesStats estadisticas={emptyStats} />);
    
    // Usar getAllByText para múltiples elementos con "0"
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(5); // 5 elementos con "0"
    
    // Para el valor de ingresos, buscar específicamente "$0"
    expect(screen.getByText('$0')).toBeInTheDocument();
  });
});