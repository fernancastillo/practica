import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Solo importa lo esencial
import Navbar from './Navbar';

// Mocks mínimos
vi.mock('../../../utils/tienda/authService', () => ({
  authService: { logout: vi.fn() }
}));

vi.mock('../../../assets/tienda/junimoss.png', () => ({
  default: 'test-logo.png'
}));

vi.mock('../../../assets/tienda/polloperfil.png', () => ({
  default: 'test-avatar.png'
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/index' })
  };
});

describe('Navbar - Minimal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn(() => null);
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renderiza el navbar sin errores', () => {
    renderNavbar();
    expect(screen.getByText('Junimo Store')).toBeInTheDocument();
  });

  it('muestra el menú principal', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Categorías')).toBeInTheDocument();
  });
});