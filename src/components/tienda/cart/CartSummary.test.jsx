import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartSummary from './CartSummary';

// Mock MUY simple sin funciones complejas
vi.mock('../../../utils/tienda/cartService', () => ({
  cartService: {
    calculateShipping: vi.fn(() => 0),
    hasDuocDiscount: vi.fn(() => false),
    calculateDuocDiscount: vi.fn(() => 0),
    calculateDiscount: vi.fn(() => 0),
    validateDiscountCode: vi.fn(() => null),
    calculateFinalTotal: vi.fn((subtotal) => subtotal)
  }
}));

// Mock simple de los modales
vi.mock('../../../components/tienda/PaymentConfirmationModal', () => ({
  default: () => <div data-testid="payment-modal">Modal de Pago</div>
}));

vi.mock('../../../components/tienda/CreditCardModal', () => ({
  default: () => <div data-testid="credit-card-modal">Modal de Tarjeta</div>
}));

describe('CartSummary - Versión Simple', () => {
  const mockCartItems = [
    { codigo: '1', nombre: 'Producto 1', precio: 10000, cantidad: 1 }
  ];

  const defaultProps = {
    cartItems: mockCartItems,
    total: 10000,
    onCheckout: vi.fn(),
    user: { nombre: 'Test User' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock básico de localStorage
    Storage.prototype.getItem = vi.fn(() => JSON.stringify([
      { codigo: '1', stock: 10 }
    ]));
  });

  it('renderiza el título del resumen', () => {
    render(
      <BrowserRouter>
        <CartSummary {...defaultProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Resumen del Pedido')).toBeInTheDocument();
  });

  it('muestra la cantidad correcta de productos', () => {
    render(
      <BrowserRouter>
        <CartSummary {...defaultProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Productos (1)')).toBeInTheDocument();
  });

  it('tiene el campo para código de descuento', () => {
    render(
      <BrowserRouter>
        <CartSummary {...defaultProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText('Ingresa código ej: SV2500')).toBeInTheDocument();
    expect(screen.getByText('Aplicar')).toBeInTheDocument();
  });
});