import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock de window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renderiza el título y descripción del footer', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText('¡Bienvenido a Junimo Store!')).toBeInTheDocument();
    expect(screen.getByText(/Es una tienda online creada por y para fanáticos del popular juego indie/)).toBeInTheDocument();
  });

  it('renderiza todos los enlaces del menú', () => {
    renderWithRouter(<Footer />);
    
    const menuLinks = [
      'Home',
      'Categorías', 
      'Ofertas',
      'Carrito',
      'Blogs',
      'Contacto',
      'Nosotros'
    ];
    
    menuLinks.forEach(linkText => {
      expect(screen.getByText(linkText)).toBeInTheDocument();
    });
  });

  it('los enlaces del menú tienen las rutas correctas', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Categorías').closest('a')).toHaveAttribute('href', '/categorias');
    expect(screen.getByText('Carrito').closest('a')).toHaveAttribute('href', '/carrito');
    expect(screen.getByText('Contacto').closest('a')).toHaveAttribute('href', '/contacto');
  });

  it('navega y hace scroll al hacer click en un enlace del menú', () => {
    renderWithRouter(<Footer />);
    
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);
    
    // Verificar que navigate fue llamado
    expect(mockNavigate).toHaveBeenCalledWith('/');
    
    // Avanzar los timers para ejecutar el setTimeout
    vi.advanceTimersByTime(100);
    
    // Verificar que scrollTo fue llamado
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });

  it('renderiza los enlaces de redes sociales', () => {
    renderWithRouter(<Footer />);
    
    const githubLinks = screen.getAllByLabelText(/GitHub/);
    expect(githubLinks).toHaveLength(2);
    
    // Verificar que los enlaces de GitHub tienen los href correctos
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/fernancastillo');
    expect(githubLinks[1]).toHaveAttribute('href', 'https://github.com/ScarthPz');
    
    // Verificar el enlace de WhatsApp
    const whatsappLink = screen.getByLabelText('Contactar por WhatsApp');
    expect(whatsappLink).toHaveAttribute('href', 'https://i.pinimg.com/736x/3d/6c/57/3d6c577dc24561124b094681759aa24a.jpg');
  });

  it('hace scroll al top al hacer click en enlaces de redes sociales', () => {
    renderWithRouter(<Footer />);
    
    const githubLink = screen.getAllByLabelText(/GitHub/)[0];
    fireEvent.click(githubLink);
    
    // Verificar que scrollTo fue llamado inmediatamente (sin setTimeout)
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
    
    // Verificar que navigate NO fue llamado para enlaces externos
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renderiza el copyright', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText(/2025 Todos los derechos reservados. Junimo Store/)).toBeInTheDocument();
  });

  it('renderiza la sección de desarrolladores', () => {
    renderWithRouter(<Footer />);
    
    const developerImage = screen.getByAltText('Developed by Tankator and Ninikyu');
    expect(developerImage).toBeInTheDocument();
  });

  it('hace scroll al top al hacer click en la imagen de desarrolladores', () => {
    renderWithRouter(<Footer />);
    
    const developerImage = screen.getByAltText('Developed by Tankator and Ninikyu');
    fireEvent.click(developerImage);
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });

  it('aplica las clases CSS correctas', () => {
    renderWithRouter(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('custom-footer', 'py-5', 'mt-auto', 'w-100');
    
    // Verificar que los títulos tienen la clase correcta
    const titles = screen.getAllByText(/¡Bienvenido a Junimo Store!|Menú|Síguenos :D/);
    titles.forEach(title => {
      expect(title).toHaveClass('footer-title');
    });
  });
});