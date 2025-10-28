import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardStats from './DashboardStats';

// Mock de formatCurrency - CORREGIDO para usar formato chileno
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => {
    if (value === 1250000) return '$1.250.000';
    if (value === 0) return '$0';
    return `$${value}`;
  }
}));

describe('DashboardStats', () => {
  const mockStats = {
    totalUsuarios: 150,
    totalProductos: 45,
    ordenesPendientes: 8,
    ingresosTotales: 1250000
  };

  it('should render all stat cards with correct data', () => {
    render(<DashboardStats stats={mockStats} />);
    
    // Usar queries más específicas para evitar conflictos con múltiples elementos
    const statValues = screen.getAllByRole('generic', { 
      name: (content, element) => 
        element.classList.contains('h5') && 
        element.classList.contains('mb-0') &&
        element.classList.contains('font-weight-bold') &&
        element.classList.contains('text-gray-800')
    });
    
    // Verificar que tenemos 4 elementos de estadísticas
    expect(statValues).toHaveLength(4);
    
    // Verificar los valores en orden
    expect(statValues[0]).toHaveTextContent('150');
    expect(statValues[1]).toHaveTextContent('45');
    expect(statValues[2]).toHaveTextContent('8');
    expect(statValues[3]).toHaveTextContent('$1.250.000'); // CORREGIDO: formato chileno
  });

  it('should render correct titles', () => {
    render(<DashboardStats stats={mockStats} />);
    
    expect(screen.getByText('Total Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Total Productos')).toBeInTheDocument();
    expect(screen.getByText('Órdenes Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Ingresos Totales')).toBeInTheDocument();
  });

  it('should handle empty stats', () => {
    const emptyStats = {
      totalUsuarios: 0,
      totalProductos: 0,
      ordenesPendientes: 0,
      ingresosTotales: 0
    };
    
    render(<DashboardStats stats={emptyStats} />);
    
    // Usar getAllByText para múltiples elementos con "0"
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(3); // 3 elementos con "0" (usuarios, productos, órdenes)
    
    // Para el valor de ingresos, buscar específicamente "$0"
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  it('should render all stat cards with icons', () => {
    render(<DashboardStats stats={mockStats} />);
    
    // Verificar que los íconos están presentes
    expect(screen.getByText('Total Usuarios').closest('.card')).toContainElement(
      document.querySelector('.bi-people-fill')
    );
    expect(screen.getByText('Total Productos').closest('.card')).toContainElement(
      document.querySelector('.bi-box-seam')
    );
    expect(screen.getByText('Órdenes Pendientes').closest('.card')).toContainElement(
      document.querySelector('.bi-clock-history')
    );
    expect(screen.getByText('Ingresos Totales').closest('.card')).toContainElement(
      document.querySelector('.bi-currency-dollar')
    );
  });
});