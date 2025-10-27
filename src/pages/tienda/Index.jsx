// src/pages/tienda/Index.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import productosData from '../../data/productos.json';
import ProductCard from '../../components/tienda/ProductCard';
import Filters from '../../components/tienda/Filters';
import { authService } from '../../utils/tienda/authService';
import { getProductosConStockActual, verificarStockDisponible } from '../../utils/tienda/stockService';
import { getProductosConOfertas, getProductosEnOferta } from '../../utils/tienda/ofertasService'; // ✅ NUEVO IMPORT

const Index = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ofertasCount, setOfertasCount] = useState(0); // ✅ CONTADOR DE OFERTAS

  const navigate = useNavigate();

  // Función para cargar productos con stock actualizado Y ofertas
  const loadProductsWithStockAndOffers = () => {
    // Inicializar productos base si no existen
    if (!localStorage.getItem('app_productos')) {
      localStorage.setItem('app_productos', JSON.stringify(productosData));
    }
    
    // Obtener productos con stock real considerando el carrito
    const productosConStock = getProductosConStockActual();
    
    // ✅ APLICAR OFERTAS a los productos
    const productosConOfertas = getProductosConOfertas();
    
    // Combinar stock actualizado con ofertas
    const productosFinales = productosConStock.map(productoStock => {
      const productoConOferta = productosConOfertas.find(p => p.codigo === productoStock.codigo);
      return productoConOferta || productoStock;
    });
    
    setProducts(productosFinales);
    setFilteredProducts(productosFinales);
    
    // ✅ CONTAR PRODUCTOS EN OFERTA
    const productosOferta = getProductosEnOferta();
    setOfertasCount(productosOferta.length);
  };

  useEffect(() => {
    loadProductsWithStockAndOffers();
    
    const uniqueCategories = ['all', ...new Set(productosData.map((product) => product.categoria))];
    setCategories(uniqueCategories);

    // Escuchar cambios en el carrito para actualizar stock
    const handleCartUpdate = () => {
      loadProductsWithStockAndOffers();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.categoria === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const handleAddToCart = (product) => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('🔐 Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    // Usar tu función verificarStockDisponible
    if (!verificarStockDisponible(product.codigo, 1)) {
      alert('❌ No hay stock disponible de este producto');
      return;
    }

    // Obtener el carrito actual
    const carritoActual = JSON.parse(localStorage.getItem('junimoCart')) || [];
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carritoActual.find(item => item.codigo === product.codigo);
    
    if (productoExistente) {
      productoExistente.cantidad += 1;
      productoExistente.subtotal = productoExistente.cantidad * productoExistente.precio;
    } else {
      carritoActual.push({
        ...product,
        cantidad: 1,
        subtotal: product.precio
      });
    }

    // Guardar en localStorage
    localStorage.setItem('junimoCart', JSON.stringify(carritoActual));

    // Disparar evento para actualizar todos los componentes
    window.dispatchEvent(new Event('cartUpdated'));

    // Recalcular stock disponible después de agregar al carrito
    const nuevoStock = getProductosConStockActual().find(p => p.codigo === product.codigo)?.stock_disponible || 0;
    
    alert(`✅ ¡${product.nombre} agregado al carrito! Stock restante: ${nuevoStock}`);
  };

  const handleDetailsClick = (productCode) => {
    navigate(`/producto/${productCode}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // ✅ FUNCIÓN PARA IR A OFERTAS
  const handleGoToOfertas = () => {
    navigate('/ofertas');
  };

  return (
    <div
      className="min-vh-100 w-100"
      style={{
        backgroundImage: 'url("src/assets/tienda/fondostardew.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <div style={{ height: '80px' }}></div>

      <section className="py-4 text-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <img
                src="src/assets/tienda/junimoshop.png"
                alt="Junimo Shop"
                className="img-fluid"
                style={{ maxWidth: '800px', width: '100%', marginTop: '2rem' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x300/2E8B57/FFFFFF?text=Junimo+Shop';
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ✅ SECCIÓN DE OFERTAS DESTACADA */}
      {ofertasCount > 0 && (
        <section className="py-3">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div 
                  className="rounded-4 p-4 text-center shadow-lg border-3 border-warning"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(255, 193, 7, 0.9))',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <h3 
                    className="fw-bold mb-3 text-white"
                    style={{ 
                      fontFamily: "'Indie Flower', cursive",
                      fontSize: '2.5rem',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    🔥 ¡Ofertas Activas!
                  </h3>
                  <p className="fs-5 text-white mb-3 fw-semibold">
                    Tenemos <Badge bg="danger" className="fs-4">{ofertasCount}</Badge> productos en oferta con descuentos increíbles
                  </p>
                  <Button 
                    variant="light" 
                    size="lg"
                    className="fw-bold border-3 border-dark rounded-3 px-4"
                    onClick={handleGoToOfertas}
                  >
                    🎁 Ver Todas las Ofertas
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      <section className="py-3 text-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h1
                className="fw-bold mb-3"
                style={{
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontSize: '2.5rem',
                  fontFamily: "'Indie Flower', cursive"
                }}
              >
                Nuestros Productos
              </h1>
              <p className="fs-5" style={{ color: 'rgba(255,255,255,0.9)', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }} >
                Descubre la magia de Stardew Valley en nuestra colección exclusiva
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-4">
        <Container>
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProducts={filteredProducts}
          />

          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.codigo} xl={3} lg={4} md={6}>
                <ProductCard
                  product={product}
                  handleAddToCart={handleAddToCart}
                  handleDetailsClick={handleDetailsClick}
                />
              </Col>
            ))}

            {filteredProducts.length === 0 && (
              <Col>
                <div className="text-center py-5">
                  <div
                    className="rounded-4 p-5"
                    style={{
                      backgroundColor: '#dedd8ff5',
                      border: '3px solid #000000'
                    }}
                  >
                    <span className="display-1" style={{ opacity: 0.8 }}>
                      🌾
                    </span>
                    <h4
                      className="text-dark mt-3 fw-bold"
                      style={{ fontFamily: "'Indie Flower', cursive" }}
                    >
                      No se encontraron productos
                    </h4>
                    <Button
                      className="mt-2 fw-bold"
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchTerm('');
                      }}
                      style={{
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        color: '#ffffff'
                      }}
                    >
                      Ver Todos los Productos
                    </Button>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Index;