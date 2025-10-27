// src/components/tienda/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { formatearPrecio, categoryIcons } from '../../utils/tienda/tiendaUtils';
import { authService } from '../../utils/tienda/authService';
import { getProductosConStockActual } from '../../utils/tienda/stockService'; // ✅ NUEVO IMPORT

const ProductCard = ({ product, handleAddToCart, handleDetailsClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stockDisponible, setStockDisponible] = useState(
    product.stock_disponible !== undefined ? product.stock_disponible : product.stock
  ); // ✅ NUEVO ESTADO PARA STOCK EN TIEMPO REAL

  // ✅ ACTUALIZAR STOCK EN TIEMPO REAL
  useEffect(() => {
    const actualizarStock = () => {
      const productosActualizados = getProductosConStockActual();
      const productoActualizado = productosActualizados.find(p => p.codigo === product.codigo);
      if (productoActualizado) {
        setStockDisponible(productoActualizado.stock_disponible);
      }
    };

    // Actualizar inicialmente
    actualizarStock();

    // Escuchar cambios en el carrito
    window.addEventListener('cartUpdated', actualizarStock);
    
    return () => {
      window.removeEventListener('cartUpdated', actualizarStock);
    };
  }, [product.codigo]);

  useEffect(() => {
    setIsLoggedIn(!!authService.getCurrentUser());
    
    const checkAuth = () => {
      setIsLoggedIn(!!authService.getCurrentUser());
    };
    
    window.addEventListener('authStateChanged', checkAuth);
    return () => window.removeEventListener('authStateChanged', checkAuth);
  }, []);

  // ✅ VERIFICAR SI EL PRODUCTO ESTÁ EN OFERTA
  const estaEnOferta = product.enOferta && product.descuento > 0;

  // ✅ ACTUALIZADO: Usar stockDisponible en tiempo real
  const getStockBadgeText = () => {
    if (stockDisponible === 0) return '❌ Sin Stock';
    if (stockDisponible < product.stock_critico) return `⚠️ ${stockDisponible} unidades`;
    return `📦 ${stockDisponible} unidades`;
  };

  const getButtonText = () => {
    if (!isLoggedIn) return '🔐 Inicia Sesión';
    if (stockDisponible === 0) return '❌ Sin Stock';
    return '🛒 Agregar al Carrito';
  };

  const isButtonDisabled = () => {
    return !isLoggedIn || stockDisponible === 0;
  };

  const getButtonStyle = () => {
    if (!isLoggedIn) {
      return {
        backgroundColor: '#6c757d',
        color: '#ffffff',
        border: '2px solid #000000',
        opacity: 1
      };
    }
    if (stockDisponible === 0) {
      return {
        backgroundColor: '#6c757d',
        color: '#ffffff',
        border: '2px solid #000000',
        opacity: 0.6
      };
    }
    return {
      backgroundColor: '#dedd8ff5',
      color: '#000000',
      border: '2px solid #000000',
      opacity: 1
    };
  };

  const getTooltipText = () => {
    if (!isLoggedIn) return 'Inicia sesión para agregar productos al carrito';
    if (stockDisponible === 0) return 'No hay stock disponible';
    return 'Agregar al carrito';
  };

  const getStockBadgeColor = () => {
    if (stockDisponible === 0) return '#dc3545';
    if (stockDisponible < product.stock_critico) return '#ffc107';
    return '#28a745';
  };

  return (
    <Card
      className="h-100 shadow border-0 position-relative"
      style={{
        borderRadius: '15px',
        backgroundColor: '#87CEEB',
        transition: 'all 0.3s ease',
        border: '2px solid #000000'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
      }}
    >
      {/* ✅ BADGE DE OFERTA */}
      {estaEnOferta && (
        <Badge 
          bg="danger" 
          className="position-absolute top-0 start-0 m-2 px-3 py-2 border-2 border-white fw-bold"
          style={{ 
            zIndex: 2,
            fontSize: '0.9rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          -{product.descuento}% OFF
        </Badge>
      )}

      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: 'transparent',
          padding: '30px 25px',
          minHeight: '240px',
          borderBottom: '2px solid #000000',
          borderTopLeftRadius: '13px',
          borderTopRightRadius: '13px'
        }}
      >
        <Card.Img
          variant="top"
          src={product.imagen}
          style={{
            width: '100%',
            maxWidth: '180px',
            height: '140px',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/2E8B57/FFFFFF?text=Imagen+No+Disponible';
          }}
        />
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge
            className="mb-2 fw-bold"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000',
              border: '1px solid #000000'
            }}
          >
            {categoryIcons[product.categoria]} {product.categoria}
          </Badge>
          {/* ✅ BADGE DE STOCK ACTUALIZADO EN TIEMPO REAL */}
          <Badge
            className="ms-1 fw-bold"
            style={{
              backgroundColor: getStockBadgeColor(),
              color: '#ffffff',
              border: '1px solid #000000'
            }}
          >
            {getStockBadgeText()}
          </Badge>
          {!isLoggedIn && (
            <Badge
              className="ms-1 fw-bold"
              style={{
                backgroundColor: '#6c757d',
                color: '#ffffff',
                border: '1px solid #000000'
              }}
            >
              🔐 Inicia Sesión
            </Badge>
          )}
        </div>

        <Card.Title
          className="h6 fw-bold"
          style={{
            color: '#000000',
            minHeight: '2.6em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.nombre}
        </Card.Title>

        <Card.Text
          className="small flex-grow-1"
          style={{
            color: '#000000',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '4.2em'
          }}
        >
          {product.descripcion}
        </Card.Text>

        <div className="mt-auto">
          {/* ✅ SECCIÓN DE PRECIO ACTUALIZADA PARA OFERTAS */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            {estaEnOferta ? (
              <div>
                {/* Precio original tachado */}
                <div 
                  className="text-muted text-decoration-line-through small"
                  style={{ lineHeight: '1' }}
                >
                  {formatearPrecio(product.precioOriginal)}
                </div>
                {/* Precio de oferta */}
                <span
                  className="fw-bold text-danger"
                  style={{ fontSize: '1.2rem', lineHeight: '1.2' }}
                >
                  {formatearPrecio(product.precioOferta)}
                </span>
              </div>
            ) : (
              <span
                className="fw-bold"
                style={{ color: '#27ae60', fontSize: '1.2rem' }}
              >
                {formatearPrecio(product.precio)}
              </span>
            )}
          </div>

          <div className="d-grid gap-2">
            <Button
              variant="outline-dark"
              size="sm"
              className="rounded fw-bold"
              onClick={() => handleDetailsClick(product.codigo)}
              style={{
                border: '2px solid #000000',
                color: '#000000',
                backgroundColor: 'transparent'
              }}
            >
              👀 Ver Detalles
            </Button>
            
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  {getTooltipText()}
                </Tooltip>
              }
            >
              <Button
                size="sm"
                className="rounded fw-bold"
                onClick={() => handleAddToCart(product)}
                disabled={isButtonDisabled()}
                style={getButtonStyle()}
              >
                {getButtonText()}
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;