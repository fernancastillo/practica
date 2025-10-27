// src/pages/tienda/Carrito.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../utils/tienda/authService';
import CartItem from '../../components/tienda/cart/CartItem';
import CartSummary from '../../components/tienda/cart/CartSummary';
import EmptyCart from '../../components/tienda/cart/EmptyCart';
import './Cart.css';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  // Función para verificar stock disponible
  const verificarStockDisponible = (productoCodigo, cantidadDeseada) => {
    try {
      const productos = JSON.parse(localStorage.getItem('app_productos')) || [];
      const producto = productos.find(p => p.codigo === productoCodigo);
      
      if (!producto) return false;
      
      // Verificar que la cantidad deseada no supere el stock real
      return cantidadDeseada <= producto.stock;
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return false;
    }
  };

  // Función para actualizar productos con stock reservado
  const actualizarProductosConStockReservado = (carritoActual) => {
    try {
      const productos = JSON.parse(localStorage.getItem('app_productos')) || [];
      
      const productosActualizados = productos.map(producto => {
        const itemEnCarrito = carritoActual.find(item => item.codigo === producto.codigo);
        return {
          ...producto,
          stock_reservado: itemEnCarrito ? itemEnCarrito.cantidad : 0
        };
      });
      
      localStorage.setItem('app_productos', JSON.stringify(productosActualizados));
    } catch (error) {
      console.error('Error al actualizar stock reservado:', error);
    }
  };

  // Cargar carrito desde localStorage
  const loadCart = () => {
    try {
      const cartJSON = localStorage.getItem('junimoCart');
      console.log('🔄 Cargando carrito desde localStorage');
      
      if (cartJSON) {
        const items = JSON.parse(cartJSON);
        console.log('📦 Productos en carrito:', items);
        setCartItems(items);
        actualizarProductosConStockReservado(items);
      } else {
        console.log('🛒 Carrito vacío');
        setCartItems([]);
      }
    } catch (error) {
      console.error('❌ Error al cargar carrito:', error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
    setUser(authService.getCurrentUser());
    
    // Escuchar eventos de actualización del carrito
    const handleCartUpdate = () => {
      console.log('📢 Carrito recibió evento de actualización');
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Actualizar cantidad
  const handleUpdateQuantity = (productCode, newQuantity) => {
    try {
      // Verificar stock disponible
      if (!verificarStockDisponible(productCode, newQuantity)) {
        alert('❌ No hay suficiente stock disponible');
        return;
      }

      const updatedCart = cartItems.map(item =>
        item.codigo === productCode
          ? { ...item, cantidad: Math.max(0, newQuantity) }
          : item
      ).filter(item => item.cantidad > 0);

      localStorage.setItem('junimoCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Actualizar productos en localStorage para reflejar stock reservado
      actualizarProductosConStockReservado(updatedCart);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  // Eliminar producto
  const handleRemoveItem = (productCode) => {
    try {
      const updatedCart = cartItems.filter(item => item.codigo !== productCode);
      localStorage.setItem('junimoCart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
      actualizarProductosConStockReservado(updatedCart);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Calcular total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Finalizar compra
  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const total = calculateTotal();
    
    try {
      console.log('✅ Compra realizada. Total:', total);
      
      // Actualizar stock real en productos
      const productos = JSON.parse(localStorage.getItem('app_productos')) || [];
      const productosActualizados = productos.map(producto => {
        const itemEnCarrito = cartItems.find(item => item.codigo === producto.codigo);
        if (itemEnCarrito) {
          return {
            ...producto,
            stock: Math.max(0, producto.stock - itemEnCarrito.cantidad)
          };
        }
        return producto;
      });
      
      localStorage.setItem('app_productos', JSON.stringify(productosActualizados));
      
      // Vaciar carrito
      localStorage.removeItem('junimoCart');
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Mostrar alerta de éxito
      setShowAlert(true);
      setTimeout(() => {
        navigate('/pedidos');
      }, 2000);
      
    } catch (error) {
      console.error('Error en checkout:', error);
    }
  };

  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="navbar-spacer"></div>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="navbar-spacer"></div>
      
      <Container className="py-4">
        {showAlert && (
          <Alert variant="success" className="text-center">
            ✅ ¡Compra realizada con éxito! Redirigiendo a tus pedidos...
          </Alert>
        )}
        
        <Row className="mb-4">
          <Col>
            <h1 className="page-title">🛒 Mi Carrito de Compras</h1>
            <p className="text-muted">
              Revisa y modifica los productos en tu carrito
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <div className="cart-items-section">
              {/* Items del carrito */}
              {cartItems.map(item => (
                <CartItem 
                  key={item.codigo}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
              
              {/* Acciones del carrito */}
              <Row className="mt-4">
                <Col>
                  <div className="d-flex justify-content-between">
                    <Button as={Link} to="/productos" variant="outline-primary">
                      ← Seguir Comprando
                    </Button>
                    
                    <Button 
                      variant="outline-danger" 
                      onClick={() => {
                        localStorage.removeItem('junimoCart');
                        setCartItems([]);
                        window.dispatchEvent(new Event('cartUpdated'));
                      }}
                    >
                      🗑️ Vaciar Carrito
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          
          <Col lg={4}>
            <CartSummary 
              cartItems={cartItems}
              total={total}
              onCheckout={handleCheckout}
              user={user}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Carrito;