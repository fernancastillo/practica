import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  // Función para manejar el click y scroll al top
  const handleLinkClick = (to) => {
    // Navegar a la ruta
    navigate(to);
    
    // Scroll al top después de un pequeño delay para asegurar la navegación
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Función específica para links externos o que no cambian de ruta
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="custom-footer py-5 mt-auto w-100">
      <Container>
        {/* Secciones principales - Centradas */}
        <Row className="gy-4 justify-content-center">
          {/* Sección de bienvenida */}
          <Col xl={8} lg={10} md={12} className="text-center">
            <div className="mb-4">
              <h5 className="footer-title mb-3">
                ¡Bienvenido a Junimo Store!
              </h5>
              <p className="footer-description mb-0">
                Es una tienda online creada por y para fanáticos del popular juego indie. 
                Ofrecemos merchandising, ropa, accesorios, guías ilustradas y servicios 
                digitales como mods y paquetes de recursos. Realizamos envíos a todo el 
                país y buscamos ser un espacio de encuentro para la comunidad de jugadores.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="gy-4 justify-content-center mt-3">
          {/* Sección de menú */}
          <Col xl={2} lg={3} md={4} sm={6} className="text-center">
            <div className="mb-4">
              <h5 className="footer-title mb-3">
                Menú
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link 
                    to="/" 
                    className="footer-link"
                    onClick={() => handleLinkClick('/')}
                  >
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/categorias" 
                    className="footer-link"
                    onClick={() => handleLinkClick('/categorias')}
                  >
                    Categorías
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/ofertas" 
                    className="footer-link"
                    onClick={() => handleLinkClick('/ofertas')}
                  >
                    Ofertas
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/carrito" 
                    className="footer-link"
                    onClick={() => handleLinkClick('/carrito')}
                  >
                    Carrito
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/blogs" 
                    className="footer-link"
                    onClick={() => handleLinkClick('/blogs')}
                  >
                    Blogs
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/contacto" 
                    className="footer-link"
                    onClick={() => handleLinkClick('/contacto')}
                  >
                    Contacto
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/nosotros" 
                    className="footer-link"
                    onClick={() => handleLinkClick('/nosotros')}
                  >
                    Nosotros
                  </Link>
                </li>
              </ul>
            </div>
          </Col>

          {/* Sección de redes sociales */}
          <Col xl={2} lg={3} md={4} sm={6} className="text-center">
            <div className="mb-4">
              <h5 className="footer-title mb-3">
                Síguenos :D
              </h5>
              <div className="d-flex justify-content-center gap-3 mb-3">
                <a 
                  href="https://github.com/fernancastillo" 
                  aria-label="GitHub Fernan"
                  className="social-link"
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-github"></i>
                </a>
                <a 
                  href="https://github.com/ScarthPz" 
                  aria-label="GitHub Scarth"
                  className="social-link"
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-github"></i>
                </a>
              </div>
              
              <div className="mt-3">
                <h6 className="footer-subtitle mb-2">
                  Contáctanos
                </h6>
                <a 
                  href="https://i.pinimg.com/736x/3d/6c/57/3d6c577dc24561124b094681759aa24a.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                  aria-label="Contactar por WhatsApp"
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-whatsapp"></i>
                </a>
              </div>
            </div>
          </Col>
        </Row>

        {/* Sección de desarrolladores */}
        <Row className="mt-4">
          <Col className="text-center">
            <div className="py-3">
              <img 
                src="../src/assets/tienda/developed-stardew.png" 
                alt="Developed by Tankator and Ninikyu" 
                className="img-fluid developer-img"
                onClick={handleScrollToTop}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </Col>
        </Row>
        
        {/* Pie de página */}
        <Row className="mt-4">
          <Col>
            <div className="text-center border-top border-dark border-opacity-25 pt-3 mt-2">
              <p className="footer-copyright mb-0">
                &copy; 2025 Todos los derechos reservados. Junimo Store
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;