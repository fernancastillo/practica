import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminProtectedRoute from './AdminProtectedRoute';

// Mock de las utilidades
vi.mock('../../utils/admin/routeProtection', () => ({
  canAccessAdmin: vi.fn(),
  getRedirectRoute: vi.fn()
}));

import { getRedirectRoute } from '../../utils/admin/routeProtection';

const MockComponent = () => <div>Protected Content</div>;

describe('AdminProtectedRoute', () => {
  it('should render children when no redirect route', () => {
    getRedirectRoute.mockReturnValue(null);
    
    const { getByText } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminProtectedRoute>
          <MockComponent />
        </AdminProtectedRoute>
      </MemoryRouter>
    );
    
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect when redirect route exists', () => {
    getRedirectRoute.mockReturnValue('/login');
    
    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <MockComponent />
              </AdminProtectedRoute>
            } 
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Verificar que se redirige (Navigate component)
    expect(container.querySelector('div')).not.toHaveTextContent('Protected Content');
  });
});