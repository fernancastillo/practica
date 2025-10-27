import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { authService } from '../../utils/tienda/authService';
import './Login.css'; // Importa el CSS

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        navigate(result.redirectTo);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-navbar-spacer"></div>
      <Container className="login-container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card login-card shadow">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
                
                {error && (
                  <div className="alert alert-danger login-alert" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
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
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Tu contraseña"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3 login-btn btn-hover-effect"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2 login-spinner" role="status" aria-hidden="true"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </form>

                <hr className="my-4 login-divider" />

                <div className="text-center">
                  <p className="mb-0 register-text">¿No tienes una cuenta?</p>
                  <Link to="/registro" className="btn btn-outline-primary mt-2 register-btn btn-hover-effect">
                    Crear Cuenta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;