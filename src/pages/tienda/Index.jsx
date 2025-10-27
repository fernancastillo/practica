// src/pages/tienda/Index.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import productosData from '../../data/productos.json';
import ProductCard from '../../components/tienda/ProductCard';
import Filters from '../../components/tienda/Filters';
import { authService } from '../../utils/tienda/authService';
import { getProductosConStockActual, verificarStockDisponible } from '../../utils/tienda/stockService';
import { getProductosConOfertas, getProductosEnOferta } from '../../utils/tienda/ofertasService';
import { dataService } from '../../utils/dataService';

const Index = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ofertasCount, setOfertasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Función para cargar productos con manejo de errores
  const loadProductsWithStockAndOffers = () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando productos para página principal...');
      
      // Verificar que los productos existan en localStorage
      const productosEnStorage = dataService.getProductos();
      console.log('📦 Productos encontrados en storage:', productosEnStorage.length);
      
      if (!productosEnStorage || productosEnStorage.length === 0) {
        const errorMsg = 'No se encontraron productos en el sistema.';
        console.error('❌', errorMsg);
        setError(errorMsg);
        setProducts([]);
        setFilteredProducts([]);
        return;
      }
      
      // Obtener productos con stock real considerando el carrito
      const productosConStock = getProductosConStockActual();
      console.log('📊 Productos con stock calculado:', productosConStock.length);
      
      if (productosConStock.length === 0) {
        console.warn('⚠️ No hay productos con stock disponible');
      }
      
      // ✅ APLICAR OFERTAS a los productos
      const productosConOfertas = getProductosConOfertas();
      console.log('🎯 Productos con ofertas aplicadas:', productosConOfertas.length);
      
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
      console.log('🔥 Productos en oferta:', productosOferta.length);
      
      console.log('✅ Productos cargados exitosamente:', productosFinales.length);
      
    } catch (err) {
      console.error('💥 Error crítico cargando productos:', err);
      setError(`Error al cargar los productos: ${err.message}`);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debug inicial
    console.log('🔍 DEBUG - Estado inicial del localStorage:');
    console.log('📦 app_productos existe:', !!localStorage.getItem('app_productos'));
    console.log('👤 app_usuarios existe:', !!localStorage.getItem('app_usuarios'));
    console.log('📋 app_ordenes existe:', !!localStorage.getItem('app_ordenes'));
    
    loadProductsWithStockAndOffers();
    
    // Obtener categorías desde los datos originales
    const uniqueCategories = ['all', ...new Set(productosData.map((product) => product.categoria))];
    setCategories(uniqueCategories);
    console.log('📂 Categorías disponibles:', uniqueCategories);

    // Escuchar cambios en el carrito para actualizar stock
    const handleCartUpdate = () => {
      console.log('🛒 Evento cartUpdated - actualizando productos...');
      loadProductsWithStockAndOffers();
    };

    // Escuchar cambios de autenticación
    const handleAuthChange = () => {
      console.log('🔐 Evento authStateChanged - actualizando interfaz...');
      loadProductsWithStockAndOffers();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('authStateChanged', handleAuthChange);
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
    console.log('🔍 Filtros aplicados - Productos mostrados:', filtered.length);
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
      productoExistente.subtotal = productoExistente.cantidad * (product.precioOferta || product.precio);
    } else {
      carritoActual.push({
        ...product,
        cantidad: 1,
        subtotal: product.precioOferta || product.precio
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

  // Función para reintentar carga
  const handleRetry = () => {
    console.log('🔄 Reintentando carga de productos...');
    loadProductsWithStockAndOffers();
  };

  // Función para resetear datos de emergencia
  const handleEmergencyReset = () => {
    if (confirm('¿Estás seguro de que quieres resetear todos los datos? Esto cargará los datos iniciales.')) {
      try {
        dataService.resetData();
        alert('✅ Datos reseteados. La página se recargará.');
        window.location.reload();
      } catch (error) {
        alert('❌ Error reseteando datos: ' + error.message);
      }
    }
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

      {/* ✅ MOSTRAR ESTADO DE CARGA */}
      {loading && (
        <Container className="py-5 text-center">
          <div 
            className="d-flex justify-content-center align-items-center py-5 rounded-4 mx-auto"
            style={{ 
              maxWidth: '500px', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Spinner animation="border" variant="warning" style={{ width: '3rem', height: '3rem' }} />
            <span className="ms-3 text-dark fs-5 fw-bold">Cargando productos...</span>
          </div>
        </Container>
      )}

      {/* ✅ MOSTRAR ERROR */}
      {error && !loading && (
        <Container className="py-4">
          <Alert variant="danger" className="text-center rounded-4">
            <Alert.Heading className="d-flex align-items-center justify-content-center">
              <span className="me-2">❌</span>
              Error al Cargar Productos
            </Alert.Heading>
            <p className="mb-3">{error}</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button variant="outline-danger" onClick={handleRetry}>
                🔄 Reintentar Carga
              </Button>
              <Button variant="warning" onClick={handleEmergencyReset}>
                🚨 Resetear Datos
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                🔃 Recargar Página
              </Button>
            </div>
          </Alert>
        </Container>
      )}

      {/* ✅ CONTENIDO PRINCIPAL - Solo mostrar si no está cargando y no hay error */}
      {!loading && !error && (
        <>
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
                  {/* ✅ CONTADOR DE PRODUCTOS */}
                  <Badge 
                    bg="success" 
                    className="fs-6 px-3 py-2 mt-2"
                  >
                    📦 {filteredProducts.length} productos encontrados
                  </Badge>
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
                        className="rounded-4 p-5 mx-auto"
                        style={{
                          backgroundColor: '#dedd8ff5',
                          border: '3px solid #000000',
                          maxWidth: '500px'
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
                        <p className="text-muted mb-4">
                          {searchTerm || selectedCategory !== 'all' 
                            ? 'Prueba con otros términos de búsqueda o categorías' 
                            : 'No hay productos disponibles en este momento'}
                        </p>
                        <Button
                          className="mt-2 fw-bold me-2"
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
                          🔄 Ver Todos los Productos
                        </Button>
                        <Button
                          variant="outline-warning"
                          className="mt-2 fw-bold"
                          onClick={handleRetry}
                        >
                          🔃 Reintentar Carga
                        </Button>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </Container>
          </section>
        </>
      )}
    </div>
  );
};

export default Index;