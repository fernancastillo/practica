// src/pages/tienda/Carrito.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../utils/tienda/authService';
import { cartService } from '../../utils/tienda/cartService';
import CartItem from '../../components/tienda/cart/CartItem';
import CartSummary from '../../components/tienda/cart/CartSummary';
import EmptyCart from '../../components/tienda/cart/EmptyCart';

const Carrito = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  // Cargar carrito desde localStorage
  const loadCart = () => {
    try {
      const items = cartService.getCart();
      console.log('🔄 Cargando carrito desde localStorage');
      
      if (items && items.length > 0) {
        console.log('📦 Productos en carrito:', items);
        setCartItems(items);
        cartService.updateReservedStock(items);
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
      if (!cartService.checkAvailableStock(productCode, newQuantity)) {
        alert('❌ No hay suficiente stock disponible');
        return;
      }

      const updatedCart = cartService.updateQuantity(productCode, newQuantity);
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  // Eliminar producto
  const handleRemoveItem = (productCode) => {
    try {
      const updatedCart = cartService.removeItem(productCode);
      setCartItems(updatedCart);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Finalizar compra
  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      console.log('✅ Compra realizada. Total:', cartService.calculateTotal(cartItems));
      
      // Procesar checkout
      cartService.processCheckout(cartItems);
      
      // Vaciar carrito
      cartService.clearCart();
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

  const total = cartService.calculateTotal(cartItems);

  if (cartItems.length === 0) {
    return (
      <div 
        className="min-vh-100 w-100"
        style={{
          backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          fontFamily: "'Lato', sans-serif"
        }}
      >
        <div style={{ height: '80px' }}></div>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100 w-100"
      style={{
        backgroundImage: 'url("https://images3.alphacoders.com/126/1269904.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <div style={{ height: '80px' }}></div>
      
      <Container className="py-4">
        {showAlert && (
          <Alert 
            variant="success" 
            className="text-center rounded-4 border-3 border-dark shadow"
            style={{
              backgroundColor: '#87CEEB',
              color: '#000000',
              fontWeight: '600',
              fontFamily: "'Lato', sans-serif"
            }}
          >
            ✅ ¡Compra realizada con éxito! Redirigiendo a tus pedidos...
          </Alert>
        )}
        
        <Row className="mb-4">
          <Col>
            <h1 
              className="text-center mb-3"
              style={{
                fontFamily: "'Indie Flower', cursive",
                color: '#000000',
                fontWeight: 'bold',
                fontSize: '2.5rem',
                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)'
              }}
            >
              🛒 Mi Carrito de Compras
            </h1>
            <p 
              className="text-center fs-5"
              style={{
                color: '#000000',
                fontWeight: '500',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.7)',
                fontFamily: "'Lato', sans-serif"
              }}
            >
              Revisa y modifica los productos en tu carrito
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <div 
              className="rounded-4 p-4 shadow-lg border-3 border-dark"
              style={{
                backgroundColor: '#87CEEB',
                fontFamily: "'Lato', sans-serif"
              }}
            >
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
                    <Button 
                      as={Link} 
                      to="/productos" 
                      variant="outline-dark" 
                      className="rounded-pill px-4 py-2 fw-bold border-3"
                      style={{
                        backgroundColor: '#dedd8ff5',
                        color: '#000000',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Lato', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(222, 221, 143, 0.6)';
                        e.target.style.backgroundColor = '#FFD700';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.backgroundColor = '#dedd8ff5';
                      }}
                    >
                      ← Seguir Comprando
                    </Button>
                    
                    <Button 
                      variant="outline-danger" 
                      className="rounded-pill px-4 py-2 fw-bold border-3"
                      style={{
                        backgroundColor: '#dedd8ff5',
                        color: '#000000',
                        borderColor: '#dc3545',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Lato', sans-serif"
                      }}
                      onClick={() => {
                        cartService.clearCart();
                        setCartItems([]);
                        window.dispatchEvent(new Event('cartUpdated'));
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
                        e.target.style.backgroundColor = '#FFD700';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.backgroundColor = '#dedd8ff5';
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