// src/components/tienda/LoginForm.ultra-minimal.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';

describe('LoginForm - Ultra Minimal', () => {
  it('renderiza el botón de login', () => {
    render(
      <BrowserRouter>
        <LoginForm 
          formData={{ email: '', password: '' }}
          loading={false}
          error=""
          showPassword={false}
          onInputChange={() => {}}
          onSubmit={() => {}}
          onTogglePassword={() => {}}
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });
});