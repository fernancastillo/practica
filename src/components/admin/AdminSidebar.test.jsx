import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSidebar, { AdminMobileNavbar } from './AdminSidebar';

// Mock de authService
vi.mock('../../utils/tienda/auth', () => ({
  authService: {
    getCurrentUser: vi.fn(() => ({ nombre: 'Admin User' })),
    logout: vi.fn()
  }
}));

import { authService } from '../../utils/tienda/auth';

// Mock de window.confirm
const mockConfirm = vi.fn();
window.confirm = mockConfirm;

describe('AdminSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sidebar with user info', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should render all menu items', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Órdenes')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  it('should call logout on confirm', () => {
    mockConfirm.mockReturnValue(true);
    
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Cerrar Sesión'));
    expect(mockConfirm).toHaveBeenCalledWith('¿Estás seguro de que quieres cerrar sesión?');
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should not call logout when cancel is clicked', () => {
    mockConfirm.mockReturnValue(false);
    
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Cerrar Sesión'));
    expect(authService.logout).not.toHaveBeenCalled();
  });
});

describe('AdminMobileNavbar', () => {
  it('should render mobile navbar', () => {
    render(
      <MemoryRouter>
        <AdminMobileNavbar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Panel Admin')).toBeInTheDocument();
  });

  it('should toggle mobile menu', () => {
    render(
      <MemoryRouter>
        <AdminMobileNavbar />
      </MemoryRouter>
    );
    
    const toggleButton = screen.getByLabelText('Toggle navigation');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});