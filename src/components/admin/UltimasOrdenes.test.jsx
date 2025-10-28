import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UltimasOrdenes from './UltimasOrdenes';

// Mock de las utilidades
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => `$${value}`,
  formatDate: (date) => '01/01/2024',
  getEstadoBadge: (estado) => 'bg-warning'
}));

describe('UltimasOrdenes', () => {
  const mockOrdenes = [
    {
      numeroOrden: 'SO1001',
      fecha: '2024-01-01',
      total: 25000,
      estadoEnvio: 'Pendiente'
    },
    {
      numeroOrden: 'SO1002',
      fecha: '2024-01-02',
      total: 15000,
      estadoEnvio: 'Entregado'
    }
  ];

  it('should render latest orders', () => {
    render(<UltimasOrdenes ordenes={mockOrdenes} />);
    
    expect(screen.getByText('Últimas Órdenes')).toBeInTheDocument();
    expect(screen.getByText('SO1001')).toBeInTheDocument();
    expect(screen.getByText('SO1002')).toBeInTheDocument();
    expect(screen.getByText('$25000')).toBeInTheDocument();
    expect(screen.getByText('$15000')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Badge count
  });

  it('should show empty state when no orders', () => {
    render(<UltimasOrdenes ordenes={[]} />);
    
    expect(screen.getByText('No hay órdenes recientes')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Badge count
  });
});