import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ formData = {}, loading = false, error = '', handleChange, handleSubmit }) => {
  // Valores por defecto para evitar errores
  const { email = '', password = '' } = formData;

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Tu contraseña"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <hr className="my-4" />

            <div className="text-center">
              <p className="mb-0">¿No tienes una cuenta?</p>
              <Link to="/registro" className="btn btn-outline-primary mt-2">
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;