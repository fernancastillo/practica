import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UsuariosStats from './UsuariosStats';

// Mock de formatCurrency
vi.mock('../../utils/admin/dashboardUtils', () => ({
  formatCurrency: (value) => `$${value}`
}));

describe('UsuariosStats', () => {
  const mockEstadisticas = {
    totalUsuarios: 50,
    totalClientes: 45,
    totalAdmins: 5,
    usuariosConCompras: 30,
    usuarioTop: {
      nombre: 'Cliente Ejemplo',
      totalGastado: 150000
    }
  };

  it('should render all user statistics', () => {
    render(<UsuariosStats estadisticas={mockEstadisticas} />);
    
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument(); // Sin compras: 50-30=20
  });

  it('should render top user when available', () => {
    render(<UsuariosStats estadisticas={mockEstadisticas} />);
    
    expect(screen.getByText('Cliente Top')).toBeInTheDocument();
    expect(screen.getByText('Cliente Ejemplo')).toBeInTheDocument();
    expect(screen.getByText('$150000')).toBeInTheDocument();
  });

  it('should not render top user when not available', () => {
    const statsSinTop = {
      totalUsuarios: 50,
      totalClientes: 45,
      totalAdmins: 5,
      usuariosConCompras: 30,
      usuarioTop: null
    };
    
    render(<UsuariosStats estadisticas={statsSinTop} />);
    
    expect(screen.queryByText('Cliente Top')).not.toBeInTheDocument();
  });
});