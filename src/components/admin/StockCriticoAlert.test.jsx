import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StockCriticoAlert from './StockCriticoAlert';

describe('StockCriticoAlert', () => {
  const mockProductos = [
    {
      codigo: 'PROD001',
      nombre: 'Producto Crítico 1',
      stock: 5,
      stock_critico: 10
    },
    {
      codigo: 'PROD002',
      nombre: 'Producto Crítico 2',
      stock: 0,
      stock_critico: 5
    }
  ];

  it('should render critical stock products', () => {
    render(<StockCriticoAlert productos={mockProductos} />);
    
    expect(screen.getByText('Productos con Stock Crítico')).toBeInTheDocument();
    expect(screen.getByText('Producto Crítico 1')).toBeInTheDocument();
    expect(screen.getByText('Producto Crítico 2')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Badge count
  });

  it('should show empty state when no critical products', () => {
    render(<StockCriticoAlert productos={[]} />);
    
    expect(screen.getByText('No hay productos con stock crítico')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Badge count
  });

  it('should display correct stock values', () => {
    render(<StockCriticoAlert productos={mockProductos} />);
    
    // Usar getAllByText para múltiples elementos con el mismo texto
    const cincoElements = screen.getAllByText('5');
    expect(cincoElements).toHaveLength(2); // Debería haber 2 elementos con "5"
    
    // Verificar elementos únicos
    expect(screen.getByText('0')).toBeInTheDocument(); // Stock agotado
    expect(screen.getByText('10')).toBeInTheDocument(); // Stock crítico
  });

  // Test adicional para verificar los badges específicos
  it('should display correct badge classes for stock levels', () => {
    render(<StockCriticoAlert productos={mockProductos} />);
    
    // Encontrar los badges por su contexto
    const stockBadges = screen.getAllByText((content, element) => {
      return element.classList.contains('badge') && 
             (content === '5' || content === '0');
    });
    
    expect(stockBadges).toHaveLength(2);
    
    // Verificar que el badge con 5 tiene clase bg-warning (stock crítico)
    const warningBadge = stockBadges.find(badge => badge.textContent === '5');
    expect(warningBadge).toHaveClass('bg-warning');
    
    // Verificar que el badge con 0 tiene clase bg-danger (sin stock)
    const dangerBadge = stockBadges.find(badge => badge.textContent === '0');
    expect(dangerBadge).toHaveClass('bg-danger');
  });
});