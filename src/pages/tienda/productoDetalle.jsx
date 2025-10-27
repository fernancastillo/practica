// src/pages/tienda/ProductoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Badge } from 'react-bootstrap';
import productosData from '../../data/productos.json';
import ProductoDetalleHeader from '../../components/tienda/ProductoDetalleHeader';
import ProductoDetalleMain from '../../components/tienda/ProductoDetalleMain';
import ProductoDetalleRelated from '../../components/tienda/ProductoDetalleRelated';
import { formatearPrecio, categoryIcons } from '../../utils/tienda/tiendaUtils';
import { verificarStockDisponible, getProductosConStockActual } from '../../utils/tienda/stockService';
import { authService } from '../../utils/tienda/authService';
import { aplicarOfertaAProducto, getProductosConOfertas } from '../../utils/tienda/ofertasService'; // ✅ NUEVO IMPORT

const ProductoDetalle = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Usar authService directamente como lo tienes configurado
    const currentUser = authService.getCurrentUser();
    console.log('🔐 DEBUG - Usuario en ProductoDetalle:', currentUser);
    setUser(currentUser);

    const cargarProductoConOferta = () => {
      // Buscar producto en datos base
      const productoEncontrado = productosData.find(p => p.codigo === codigo);
      
      if (productoEncontrado) {
        // ✅ APLICAR OFERTA si existe
        const productoConOferta = aplicarOfertaAProducto(productoEncontrado);
        
        const productosConStock = getProductosConStockActual();
        const productoActualizado = productosConStock.find(p => p.codigo === codigo) || productoConOferta;
        
        // Aplicar oferta también al producto actualizado con stock
        const productoFinal = aplicarOfertaAProducto(productoActualizado);
        
        setProduct(productoFinal);
        
        // Cargar productos relacionados también con ofertas aplicadas
        const productosConOfertas = getProductosConOfertas();
        const relacionados = productosConOfertas
          .filter(p => p.categoria === productoFinal.categoria && p.codigo !== codigo)
          .slice(0, 4);
        setRelatedProducts(relacionados);
      } else {
        navigate('/productos');
      }
    };

    cargarProductoConOferta();
  }, [codigo, navigate]);

  // ✅ Escuchar cambios en la autenticación
  useEffect(() => {
    const handleAuthChange = () => {
      const currentUser = authService.getCurrentUser();
      console.log('🔐 DEBUG - Evento authStateChanged recibido:', currentUser);
      setUser(currentUser);
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    console.log('🛒 DEBUG - Intentando agregar al carrito. Usuario:', user);
    console.log('🛒 DEBUG - Producto:', product.nombre);
    console.log('🛒 DEBUG - Cantidad:', cantidad);

    // Verificar si el usuario ha iniciado sesión
    if (!user) {
      console.log('❌ DEBUG - Usuario no autenticado, redirigiendo a login');
      alert('🔐 Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    // Verificar stock usando tu servicio
    if (!verificarStockDisponible(product.codigo, cantidad)) {
      alert('❌ No hay suficiente stock disponible');
      return;
    }

    const savedCart = localStorage.getItem('junimoCart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cartItems.find(item => item.codigo === product.codigo);
    
    let newCartItems;
    if (existingItem) {
      newCartItems = cartItems.map(item =>
        item.codigo === product.codigo
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      newCartItems = [...cartItems, { 
        ...product, 
        cantidad: cantidad,
        // ✅ Usar precio de oferta si existe, sino precio normal
        precio: product.precioOferta || product.precio
      }];
    }

    localStorage.setItem('junimoCart', JSON.stringify(newCartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Obtener stock actualizado después de agregar al carrito
    const stockActualizado = getProductosConStockActual().find(p => p.codigo === product.codigo)?.stock_disponible;
    
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    
    console.log('✅ DEBUG - Producto agregado exitosamente al carrito');
    alert(`✅ ¡${cantidad} ${product.nombre} agregado(s) al carrito! Stock restante: ${stockActualizado}`);
    
    // Resetear cantidad a 1 después de agregar al carrito
    setCantidad(1);
  };

  const handleRelatedProductClick = (productCode) => {
    navigate(`/producto/${productCode}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // ✅ DEBUG: Mostrar estado del usuario en la consola
  useEffect(() => {
    console.log('🔐 DEBUG - Estado user actualizado:', user);
  }, [user]);

  if (!product) {
    return (
      <div 
        className="min-vh-100"
        style={{
          backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          fontFamily: "'Lato', sans-serif"
        }}
      >
        <div style={{ height: '100px' }}></div>
        <Container className="text-center py-5">
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <span 
              className="display-1 mb-3"
              style={{ 
                color: '#dedd8ff5',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
                animation: 'spin 2s linear infinite'
              }}
            >
              🌾
            </span>
            <h4 className="text-white fw-bold">Cargando producto...</h4>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100"
      style={{
        backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <div style={{ height: '100px' }}></div>

      {showAlert && (
        <Alert 
          variant="success" 
          className="position-fixed top-0 end-0 m-3 rounded-3 border-2 border-success fw-bold"
          style={{ zIndex: 1050 }}
        >
          ¡{product.nombre} agregado al carrito!
        </Alert>
      )}

      <Container className="py-4">
        {/* ✅ MOSTRAR BADGE DE OFERTA EN EL HEADER */}
        {product.enOferta && (
          <div className="text-center mb-4">
            <Badge 
              bg="danger" 
              className="fs-4 px-4 py-3 border-3 border-white fw-bold"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              🔥 OFERTA ESPECIAL - {product.descuento}% DE DESCUENTO
            </Badge>
          </div>
        )}

        <ProductoDetalleHeader />

        <ProductoDetalleMain 
          product={product}
          cantidad={cantidad}
          setCantidad={setCantidad}
          handleAddToCart={handleAddToCart}
          formatearPrecio={formatearPrecio}
          categoryIcons={categoryIcons}
          user={user}
        />

        {relatedProducts.length > 0 && (
          <ProductoDetalleRelated 
            relatedProducts={relatedProducts}
            handleRelatedProductClick={handleRelatedProductClick}
            formatearPrecio={formatearPrecio}
            categoryIcons={categoryIcons}
          />
        )}
      </Container>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ProductoDetalle;