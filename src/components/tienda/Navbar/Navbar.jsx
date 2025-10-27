import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { authService } from '../../../utils/tienda/authService';
import junimoLogo from '../../../assets/tienda/junimoss.png';
import polloPerfil from '../../../assets/tienda/polloperfil.png';
import './navbar.css';

const CustomNavbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'index', label: 'Home', path: '/index' },
    { id: 'ofertas', label: 'Ofertas', path: '/ofertas' },
    { id: 'nosotros', label: 'Nosotros', path: '/nosotros' },
    { id: 'blog', label: 'Blog', path: '/blogs' },
    { id: 'contacto', label: 'Contacto', path: '/contacto' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (to) => {
    navigate(to);
    setTimeout(scrollToTop, 100);
  };

  const getCurrentUserData = () => {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) return JSON.parse(authUser);
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) return JSON.parse(currentUser);
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  };

  const getCartItemCount = () => {
    try {
      const savedCart = localStorage.getItem('junimoCart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        return cartItems.reduce((total, item) => total + (item.cantidad || 0), 0);
      }
    } catch (error) {
      console.error('Error al obtener carrito:', error);
    }
    return 0;
  };

  const updateCartCount = () => {
    setCartItemCount(getCartItemCount());
  };

  useEffect(() => {
    const user = getCurrentUserData();
    setCurrentUser(user);
    updateCartCount();
  }, [location]);

  useEffect(() => {
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/index');
    scrollToTop();
  };

  const handleDropdownClick = (path) => {
    navigate(path);
    setTimeout(scrollToTop, 100);
  };

  return (
    <Navbar expand="lg" className="custom-navbar py-1" fixed="top">
      <Container fluid="xxl">
        {/* Logo */}
        <Navbar.Brand 
          as={Link} 
          to="/index" 
          className="d-flex align-items-center"
          onClick={scrollToTop}
        >
          <img src={junimoLogo} alt="Logo Junimo" className="logo-image me-2" />
          <span className="logo-text d-none d-sm-block">Junimo Store</span>
        </Navbar.Brand>

        {/* Toggler */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-1" />

        {/* Menu */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.id}
                as={Link}
                to={item.path}
                className={`nav-menu-item mx-1 ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleLinkClick(item.path)}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* User Actions */}
          <Nav className="align-items-center">
            {/* Cart con ícono de Bootstrap */}
            <Nav.Link 
              as={Link} 
              to="/carrito" 
              className="position-relative me-3"
              onClick={scrollToTop}
            >
              <i className="bi bi-cart3 fs-5"></i>
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger small">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Nav.Link>

            {/* User Menu */}
            {currentUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle as="div" className="d-flex align-items-center cursor-pointer">
                  <img src={polloPerfil} alt="Perfil" className="user-avatar me-2" />
                  <span className="user-name d-none d-md-block">
                    {currentUser.nombre}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="border-0 shadow">
                  {/* User Info */}
                  <div className="p-3 bg-dark text-white">
                    <div className="d-flex align-items-center">
                      <img src={polloPerfil} alt="Perfil" className="user-avatar-large me-3" />
                      <div>
                        <strong>{currentUser.nombre} {currentUser.apellido}</strong>
                        <div className="small opacity-75">{currentUser.email}</div>
                        {currentUser.descuento && currentUser.descuento !== '0%' && (
                          <span className="badge bg-warning text-dark mt-1 small">
                            🎓 {currentUser.descuento}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <Dropdown.Item onClick={() => handleDropdownClick('/perfil')}>
                    <img src={polloPerfil} alt="Perfil" className="dropdown-icon me-2" />
                    Mi Perfil
                  </Dropdown.Item>
                  
                  <Dropdown.Item onClick={() => handleDropdownClick('/pedidos')}>
                    <span className="me-2">📦</span>
                    Mis Pedidos
                  </Dropdown.Item>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <span className="me-2">🚪</span>
                    Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              // Texto en lugar de imagen
              <Nav.Link 
                as={Link} 
                to="/login" 
                className="login-text-btn fw-bold"
                onClick={scrollToTop}
              >
                Iniciar Sesión/Registrarse
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;