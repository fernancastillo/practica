// src/components/admin/AdminSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { authService } from '../../utils/tienda/auth';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: 'bi bi-speedometer2', label: 'Dashboard' },
    { path: '/admin/ordenes', icon: 'bi bi-cart-check', label: 'Órdenes' },
    { path: '/admin/productos', icon: 'bi bi-box-seam', label: 'Productos' },
    { path: '/admin/usuarios', icon: 'bi bi-people', label: 'Usuarios' },
    { path: '/admin/perfil', icon: 'bi bi-person', label: 'Perfil' },
  ];

  // ✅ Función para cerrar sesión
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      authService.logout();
    }
  };

  return (
    <div 
      className="position-fixed start-0 top-0 h-100" 
      style={{ 
        backgroundColor: '#dedd8ff5',
        width: 'inherit', // Mantener el ancho original
        zIndex: 1000,
        overflowY: 'auto' // Permitir scroll si el contenido es muy largo
      }}
    >
      <div className="sidebar-sticky h-100 d-flex flex-column">          
        {/* Header compacto */}
        <div 
          className="p-2 text-center flex-shrink-0" 
          style={{ backgroundColor: '#c9c87ae5' }}
        >
          <h6 className="mb-0 small text-dark">Admin</h6>
          <small className="text-muted">
            {authService.getCurrentUser()?.nombre || 'Administrador'}
          </small>
        </div>
        
        {/* Menú - ocupa el espacio restante */}
        <div className="flex-grow-1 overflow-auto">
          <ul className="nav nav-pills flex-column p-2 m-0">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item mb-1">
                <Link 
                  to={item.path} 
                  className={`admin-sidebar-link nav-link text-dark d-flex flex-column align-items-center p-2 ${
                    location.pathname === item.path ? 'active fw-bold' : ''
                  }`}
                  style={{ 
                    backgroundColor: location.pathname === item.path ? '#c9c87ae5' : 'transparent',
                  }}
                  title={item.label}
                >
                  <i className={`${item.icon} fs-5`}></i>
                  <small className="mt-1" style={{ fontSize: '0.7rem' }}>{item.label}</small>
                </Link>
              </li>
            ))}
            
            {/* ✅ BOTÓN DE CERRAR SESIÓN */}
            <li className="nav-item mt-auto pt-3 border-top border-dark">
              <button 
                onClick={handleLogout}
                className="admin-sidebar-link nav-link text-dark d-flex flex-column align-items-center p-2 fw-bold w-100 border-0"
                style={{ 
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
                title="Cerrar Sesión"
              >
                <i className="bi bi-box-arrow-right fs-5"></i>
                <small className="mt-1" style={{ fontSize: '0.7rem' }}>Cerrar Sesión</small>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ✅ COMPONENTE SEPARADO para el navbar móvil
export const AdminMobileNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);

  const menuItems = [
    { path: '/admin/dashboard', icon: 'bi bi-speedometer2', label: 'Dashboard' },
    { path: '/admin/ordenes', icon: 'bi bi-cart-check', label: 'Órdenes' },
    { path: '/admin/productos', icon: 'bi bi-box-seam', label: 'Productos' },
    { path: '/admin/usuarios', icon: 'bi bi-people', label: 'Usuarios' },
    { path: '/admin/perfil', icon: 'bi bi-person', label: 'Perfil' },
  ];

  // ✅ Función para cerrar sesión
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      authService.logout();
    }
  };

  // ✅ Cerrar menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div ref={navbarRef}>
      {/* ✅ Navbar móvil */}
      <nav 
        className="navbar navbar-dark d-md-none fixed-top" 
        style={{ 
          backgroundColor: '#dedd8ff5',
          minHeight: '56px',
          zIndex: 1030 // Mayor z-index para mobile
        }}
      >
        <div className="container-fluid">
          <span className="navbar-brand text-dark fw-bold">Panel Admin</span>
          <button 
            className="navbar-toggler border-dark btn-hover-effect"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* ✅ Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div 
          className="d-md-none position-fixed" 
          style={{ 
            top: '56px',
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 1020,
            backgroundColor: '#dedd8ff5',
            borderTop: '1px solid #c9c87ae5',
            overflowY: 'auto'
          }}
        >
          <ul className="nav nav-pills flex-column p-3 m-0 h-100">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item mb-2">
                <Link 
                  to={item.path} 
                  className={`admin-sidebar-link nav-link text-dark d-flex align-items-center py-3 ${
                    location.pathname === item.path ? 'active fw-bold' : ''
                  }`}
                  style={{ 
                    backgroundColor: location.pathname === item.path ? '#c9c87ae5' : 'transparent',
                    borderRadius: '8px'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`${item.icon} me-3 fs-5`}></i>
                  <span className="fs-6">{item.label}</span>
                </Link>
              </li>
            ))}
            
            {/* ✅ BOTÓN DE CERRAR SESIÓN EN MÓVIL */}
            <li className="nav-item mt-auto pt-3 border-top border-dark">
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="admin-sidebar-link nav-link text-dark d-flex align-items-center py-3 fw-bold w-100 border-0"
                style={{ 
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <i className="bi bi-box-arrow-right me-3 fs-5"></i>
                <span className="fs-6">Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;