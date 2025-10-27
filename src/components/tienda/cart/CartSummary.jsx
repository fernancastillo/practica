// src/components/tienda/cart/CartSummary.jsx
import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CartSummary = ({ cartItems, total, onCheckout, user }) => {
  const hasLowStock = cartItems.some(item => {
    const stockReal = JSON.parse(localStorage.getItem('app_productos'))?.find(p => p.codigo === item.codigo)?.stock || item.stock;
    return item.cantidad > stockReal;
  });
  
  const isCartEmpty = cartItems.length === 0;

  return (
    <Card 
      className="shadow border-0"
      style={{
        backgroundColor: 'rgba(222, 221, 143, 0.95)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        fontFamily: "'Lato', sans-serif"
      }}
    >
      <Card.Header 
        className="border-0"
        style={{
          background: 'linear-gradient(135deg, #2E8B57, #3CB371)',
          borderBottom: '2px solid #ffffff',
          borderRadius: '13px 13px 0 0'
        }}
      >
        <h5 
          className="mb-0 text-center"
          style={{
            fontFamily: "'Indie Flower', cursive",
            color: '#ffffff',
            fontSize: '1.5rem',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        >
          Resumen del Pedido
        </h5>
      </Card.Header>
      
      <Card.Body style={{ backgroundColor: 'transparent' }}>
        {hasLowStock && (
          <Alert 
            variant="warning" 
            className="small border-0 rounded-3"
            style={{
              backgroundColor: 'rgba(255, 193, 7, 0.9)',
              border: '1px solid #ffffff',
              color: '#000000',
              fontWeight: '600'
            }}
          >
            ⚠️ Algunos productos tienen stock limitado
          </Alert>
        )}
        
        <div 
          className="d-flex justify-content-between mb-2"
          style={{ color: '#000000', fontWeight: '600' }}
        >
          <span>Productos ({cartItems.reduce((sum, item) => sum + item.cantidad, 0)})</span>
          <span style={{ color: '#2E8B57' }}>${total.toLocaleString('es-CL')}</span>
        </div>
        
        <div 
          className="d-flex justify-content-between mb-2"
          style={{ color: '#000000', fontWeight: '600' }}
        >
          <span>Envío</span>
          <span className="text-success fw-bold">Gratis</span>
        </div>
        
        <hr style={{ borderColor: '#2E8B57', opacity: '0.6' }} />
        
        <div 
          className="d-flex justify-content-between mb-3"
          style={{ fontSize: '1.2rem', color: '#000000' }}
        >
          <strong>Total</strong>
          <strong style={{ color: '#2E8B57', fontSize: '1.4rem' }}>
            ${total.toLocaleString('es-CL')}
          </strong>
        </div>
        
        {!user ? (
          <Alert 
            variant="info" 
            className="small border-0 rounded-3"
            style={{
              backgroundColor: 'rgba(135, 206, 235, 0.9)',
              border: '1px solid #ffffff',
              color: '#000000',
              fontWeight: '600'
            }}
          >
            💡 Inicia sesión para proceder con la compra
          </Alert>
        ) : null}
        
        <div className="d-grid gap-2">
          <Button
            variant="success"
            size="lg"
            className="border-0 rounded-pill fw-bold py-3"
            style={{
              background: 'linear-gradient(135deg, #2E8B57, #3CB371)',
              border: '2px solid #ffffff',
              transition: 'all 0.3s ease'
            }}
            onClick={onCheckout}
            disabled={isCartEmpty || !user || hasLowStock}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 139, 87, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {!user ? 'Inicia Sesión para Comprar' : 
             hasLowStock ? 'Revisa el Stock' : 
             `Finalizar Compra - $${total.toLocaleString('es-CL')}`}
          </Button>
          
          {isCartEmpty && (
            <Button 
              as={Link} 
              to="/productos" 
              variant="outline-light" 
              className="rounded-pill fw-semibold py-2"
              style={{
                border: '2px solid #ffffff',
                color: '#000000',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
              }}
            >
              Seguir Comprando
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartSummary;