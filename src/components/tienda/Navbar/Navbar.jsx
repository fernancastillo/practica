import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Modal, Button } from 'react-bootstrap';
import { authService } from '../../../utils/tienda/authService';
import junimoLogo from '../../../assets/tienda/junimoss.png';
import polloPerfil from '../../../assets/tienda/polloperfil.png';
import './navbar.css';

const CustomNavbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'index', label: 'Home', path: '/index' },
    { id: 'categorias', label: 'Categorías', path: '/categorias' },
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

  const handleLogoutConfirm = () => {
    // ✅ BORRAR CARRITO AL CERRAR SESIÓN
    localStorage.removeItem('junimoCart');
    
    authService.logout();
    setCurrentUser(null);
    
    // Actualizar contador del carrito
    updateCartCount();
    
    // Disparar evento para actualizar otros componentes
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Cerrar modal
    setShowLogoutModal(false);
    
    // Redirigir al index
    navigate('/index');
    scrollToTop();
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleDropdownClick = (path) => {
    navigate(path);
    setTimeout(scrollToTop, 100);
  };

  return (
    <>
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
              {/* Cart con ícono de Bootstrap y badge corregido */}
              <Nav.Link 
                as={Link} 
                to="/carrito" 
                className="position-relative me-3"
                onClick={scrollToTop}
              >
                <i className="bi bi-cart3 fs-5"></i>
                {cartItemCount > 0 && (
                  <span 
                    className={`cart-badge ${cartItemCount < 10 ? 'small-number' : ''}`}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Nav.Link>

              {/* User Menu */}
              {currentUser ? (
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    as="div" 
                    className="d-flex align-items-center cursor-pointer user-dropdown-toggle"
                  >
                    <img src={polloPerfil} alt="Perfil" className="user-avatar me-2" />
                    <span className="user-name d-none d-md-block">
                      {currentUser.nombre}
                    </span>
                    {/* ✅ FLECHA HACIA ABAJO */}
                    
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="border-0 shadow custom-dropdown-menu">
                    {/* User Info - ahora con colores del navbar */}
                    <div className="user-info-header">
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
                    
                    <Dropdown.Divider className="dropdown-divider" />
                    
                    {/* Menu Items */}
                    <Dropdown.Item 
                      onClick={() => handleDropdownClick('/perfil')}
                      className="custom-dropdown-item"
                    >
                      <img src={polloPerfil} alt="Perfil" className="dropdown-icon me-2" />
                      Mi Perfil
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      onClick={() => handleDropdownClick('/pedidos')}
                      className="custom-dropdown-item"
                    >
                      <span className="me-2">📦</span>
                      Mis Pedidos
                    </Dropdown.Item>
                    
                    <Dropdown.Divider className="dropdown-divider" />
                    
                    <Dropdown.Item 
                      onClick={handleLogoutClick} 
                      className="custom-dropdown-item text-danger"
                    >
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

      {/* Modal de Confirmación de Cierre de Sesión */}
      <Modal
        show={showLogoutModal}
        onHide={handleCancelLogout}
        centered
        size="md"
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        <Modal.Header 
          className="border-3 border-dark"
          style={{
            backgroundColor: '#dedd8ff5',
          }}
        >
          <Modal.Title className="fw-bold text-center w-100" style={{ color: '#000000' }}>
            <span style={{ fontFamily: "'Indie Flower', cursive", fontSize: '1.5rem' }}>
              🚪 Confirmar Cierre de Sesión
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="text-center py-4"
          style={{
            backgroundColor: '#dedd8ff5',
          }}
        >
          <div className="mb-4">
            <div 
              className="display-1 mb-3"
              style={{ color: '#000000' }}
            >
              ❓
            </div>
            <h4 
              className="fw-bold mb-3"
              style={{ 
                color: '#000000',
                fontFamily: "'Lato', sans-serif"
              }}
            >
              ¿Estás seguro de que quieres cerrar sesión?
            </h4>
            <p 
              className="fs-6"
              style={{ 
                color: '#000000',
                fontWeight: '400'
              }}
            >
              Se eliminarán los productos de tu carrito y deberás iniciar sesión nuevamente para acceder a tu cuenta.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer
          className="border-3 border-dark justify-content-center"
          style={{
            backgroundColor: '#dedd8ff5',
          }}
        >
          <Button 
            variant="outline-dark"
            onClick={handleCancelLogout}
            className="rounded-pill px-4 py-2 border-3 fw-bold me-3"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              transition: 'all 0.3s ease',
              fontFamily: "'Lato', sans-serif",
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#FFFFFF';
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleLogoutConfirm}
            className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
            style={{
              backgroundColor: '#FF6B6B',
              color: '#000000',
              transition: 'all 0.3s ease',
              fontFamily: "'Lato', sans-serif",
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 10px rgba(255, 107, 107, 0.4)';
              e.target.style.backgroundColor = '#FF5252';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#FF6B6B';
            }}
          >
            Sí, Cerrar Sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomNavbar;