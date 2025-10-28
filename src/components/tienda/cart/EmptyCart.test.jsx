import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmptyCart from './EmptyCart';

// Mock correcto para imágenes
vi.mock('../../../assets/tienda/carrito.png', () => ({
  default: 'mocked-carrito-image.png'
}));

describe('EmptyCart', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renderiza el mensaje de carrito vacío', () => {
    renderWithRouter(<EmptyCart />);
    
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.getByText('¡Descubre nuestros productos exclusivos de Stardew Valley!')).toBeInTheDocument();
  });

  it('muestra la imagen del carrito', () => {
    renderWithRouter(<EmptyCart />);
    
    const image = screen.getByAltText('Carrito Vacío');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'mocked-carrito-image.png');
  });

  it('tiene el botón para explorar productos con el enlace correcto', () => {
    renderWithRouter(<EmptyCart />);
    
    // Buscar por role "button" en lugar de "link"
    const exploreButton = screen.getByRole('button', { name: /explorar productos/i });
    expect(exploreButton).toBeInTheDocument();
    expect(exploreButton).toHaveAttribute('href', '/productos');
  });

  it('muestra el emoji fallback cuando la imagen falla al cargar', () => {
    renderWithRouter(<EmptyCart />);
    
    const image = screen.getByAltText('Carrito Vacío');
    
    // Simular error en la carga de la imagen
    fireEvent.error(image);
    
    // Verificar que el emoji fallback se muestra
    const fallbackEmoji = document.getElementById('fallback-emoji');
    expect(fallbackEmoji).toBeInTheDocument();
    expect(fallbackEmoji).toHaveTextContent('🛒');
  });

  it('aplica los estilos correctos al botón', () => {
    renderWithRouter(<EmptyCart />);
    
    // Buscar por role "button" en lugar de "link"
    const exploreButton = screen.getByRole('button', { name: /explorar productos/i });
    
    // Verificar clases de Bootstrap
    expect(exploreButton).toHaveClass('rounded-pill', 'px-5', 'py-3', 'fw-bold', 'border-3', 'border-dark');
    expect(exploreButton).toHaveClass('btn-warning', 'btn-lg');
  });

  it('el botón tiene los estilos inline correctos', () => {
    renderWithRouter(<EmptyCart />);
    
    const exploreButton = screen.getByRole('button', { name: /explorar productos/i });
    
    // Verificar estilos inline
    expect(exploreButton).toHaveStyle({
      background: 'rgba(222, 221, 143, 0.96)',
      color: 'rgb(0, 0, 0)'
    });
  });
});