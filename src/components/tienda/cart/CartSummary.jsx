// src/components/tienda/CartSummary.jsx
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
    <Card className="shadow-sm">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">Resumen del Pedido</h5>
      </Card.Header>
      
      <Card.Body>
        {hasLowStock && (
          <Alert variant="warning" className="small">
            ⚠️ Algunos productos tienen stock limitado
          </Alert>
        )}
        
        <div className="d-flex justify-content-between mb-2">
          <span>Productos ({cartItems.reduce((sum, item) => sum + item.cantidad, 0)})</span>
          <span>${total.toLocaleString('es-CL')}</span>
        </div>
        
        <div className="d-flex justify-content-between mb-2">
          <span>Envío</span>
          <span className="text-success">Gratis</span>
        </div>
        
        <hr />
        
        <div className="d-flex justify-content-between mb-3">
          <strong>Total</strong>
          <strong className="text-success h5">
            ${total.toLocaleString('es-CL')}
          </strong>
        </div>
        
        {!user ? (
          <Alert variant="info" className="small">
            💡 Inicia sesión para proceder con la compra
          </Alert>
        ) : null}
        
        <div className="d-grid gap-2">
          <Button
            variant="success"
            size="lg"
            onClick={onCheckout}
            disabled={isCartEmpty || !user || hasLowStock}
          >
            {!user ? 'Inicia Sesión para Comprar' : 
             hasLowStock ? 'Revisa el Stock' : 
             `Finalizar Compra - $${total.toLocaleString('es-CL')}`}
          </Button>
          
          {isCartEmpty && (
            <Button as={Link} to="/productos" variant="outline-primary">
              Seguir Comprando
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartSummary;