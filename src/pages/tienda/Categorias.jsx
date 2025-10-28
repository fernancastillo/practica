import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../../components/tienda/CategoryCard';
import CardProductos from '../../components/tienda/CardProductos';
import { loadCategoriesAndProducts, calcularPorcentajeDescuento } from '../../utils/tienda/categoriaService';
import { getProductosEnOferta } from '../../utils/tienda/ofertasService';
import { scrollToTop } from '../../utils/tienda/tiendaUtils';

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [headerImageError, setHeaderImageError] = useState(false);

  const navigate = useNavigate();

  // Cargar categorías y productos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const categoriasData = await loadCategoriesAndProducts();
      setCategories(categoriasData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Manejar click en categoría
  const handleCategoryClick = (categoria) => {
    setProductsLoading(true);
    setSelectedCategory(categoria);
    
    setTimeout(() => {
      setProductsLoading(false);
      setTimeout(() => {
        document.getElementById('productos-categoria')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }, 500);
  };

  // Volver a categorías
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    scrollToTop();
  };

  // Ver detalles del producto
  const handleProductDetails = (productCode) => {
    navigate(`/producto/${productCode}`);
    setTimeout(scrollToTop, 100);
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

      <Container className="py-5">
        {/* Encabezado con imagen */}
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            {!headerImageError ? (
              <img
                src="../src/assets/tienda/categorias.png"
                alt="Nuestras Categorías"
                className="img-fluid mb-4"
                style={{ 
                  maxWidth: '1000px', 
                  width: '100%',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
                }}
                onError={() => setHeaderImageError(true)}
              />
            ) : (
              <h1
                className="fw-bold mb-3"
                style={{
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontSize: '2.5rem',
                  fontFamily: "'Indie Flower', cursive"
                }}
              >
                Nuestras Categorías
              </h1>
            )}
            
            <p 
              className="fs-5 mb-4"
              style={{ 
                color: 'rgba(255,255,255,0.9)', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)' 
              }}
            >
              {selectedCategory 
                ? `Explora todos los productos de ${selectedCategory.nombre}`
                : 'Descubre todos nuestros productos organizados por categorías'
              }
            </p>

            {selectedCategory && (
              <Button
                style={{ 
                  backgroundColor: '#dedd8ff5',
                  color: '#000000',
                  border: '2px solid #000000',
                  fontWeight: 'bold'
                }}
                className="mb-4"
                onClick={handleBackToCategories}
              >
                Volver a Categorías
              </Button>
            )}
          </Col>
        </Row>

        {/* Contenido Principal */}
        {loading ? (
          <Row className="justify-content-center py-5">
            <Col className="text-center">
              <Spinner animation="border" variant="warning" style={{ width: '3rem', height: '3rem' }} />
              <p className="mt-3 text-white fs-5">Cargando categorías...</p>
            </Col>
          </Row>
        ) : selectedCategory ? (
          // Vista de productos de categoría seleccionada
          <>
            <div id="productos-categoria">
              <Row className="mb-4">
                <Col>
                  <div 
                    className="rounded-4 p-4 text-center"
                    style={{
                      backgroundColor: 'rgba(222, 221, 143, 0.95)',
                      border: '3px solid #000000'
                    }}
                  >
                    <h3 
                      className="fw-bold mb-2 text-dark"
                      style={{ fontFamily: "'Indie Flower', cursive" }}
                    >
                      {selectedCategory.nombre}
                    </h3>
                    <p className="mb-0 text-dark">
                      Mostrando <Badge bg="success">{selectedCategory.cantidadProductos}</Badge> productos
                    </p>
                  </div>
                </Col>
              </Row>

              {productsLoading ? (
                <Row className="justify-content-center py-5">
                  <Col className="text-center">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3 text-white">Cargando productos...</p>
                  </Col>
                </Row>
              ) : (
                <Row>
                  {selectedCategory.productos.map((product) => (
                    <CardProductos
                      key={product.codigo}
                      product={product}
                      onDetailsClick={handleProductDetails}
                      calcularPorcentajeDescuento={calcularPorcentajeDescuento}
                      getProductosEnOferta={getProductosEnOferta}
                    />
                  ))}
                  
                  {selectedCategory.productos.length === 0 && (
                    <Col className="text-center py-5">
                      <div
                        className="rounded-4 p-5 mx-auto"
                        style={{
                          backgroundColor: 'rgba(222, 221, 143, 0.95)',
                          border: '3px solid #000000',
                          maxWidth: '500px'
                        }}
                      >
                        <span className="display-1">🌾</span>
                        <h4 className="text-dark mt-3 fw-bold">
                          No hay productos en esta categoría
                        </h4>
                        <Button
                          style={{ 
                            backgroundColor: '#87CEEB',
                            color: '#000000',
                            border: '2px solid #000000',
                            fontWeight: 'bold'
                          }}
                          className="mt-3"
                          onClick={handleBackToCategories}
                        >
                          Volver a Categorías
                        </Button>
                      </div>
                    </Col>
                  )}
                </Row>
              )}
            </div>
          </>
        ) : (
          // Vista de todas las categorías
          <Row>
            {categories.map((categoria) => (
              <CategoryCard
                key={categoria.nombre}
                categoria={categoria}
                onCategoryClick={handleCategoryClick}
              />
            ))}
            
            {categories.length === 0 && !loading && (
              <Col className="text-center py-5">
                <div
                  className="rounded-4 p-5 mx-auto"
                  style={{
                    backgroundColor: 'rgba(222, 221, 143, 0.95)',
                    border: '3px solid #000000',
                    maxWidth: '500px'
                  }}
                >
                  <span className="display-1">📦</span>
                  <h4 className="text-dark mt-3 fw-bold">
                    No hay categorías disponibles
                  </h4>
                  <p className="text-muted">
                    No se encontraron categorías de productos.
                  </p>
                </div>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Categorias;