// src/components/tienda/CartItem.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [stockReal, setStockReal] = useState(item.stock);

  // Verificar stock real
  useEffect(() => {
    const verificarStock = () => {
      try {
        const productos = JSON.parse(localStorage.getItem('app_productos')) || [];
        const productoActual = productos.find(p => p.codigo === item.codigo);
        if (productoActual) {
          setStockReal(productoActual.stock);
        }
      } catch (error) {
        console.error('Error al verificar stock:', error);
      }
    };

    verificarStock();
    window.addEventListener('cartUpdated', verificarStock);
    
    return () => {
      window.removeEventListener('cartUpdated', verificarStock);
    };
  }, [item.codigo]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0 && newQuantity <= stockReal) {
      onUpdateQuantity(item.codigo, newQuantity);
    } else {
      alert(`❌ Solo hay ${stockReal} unidades disponibles`);
    }
  };

  const subtotal = item.precio * item.cantidad;

  return (
    <Row className="cart-item align-items-center py-3 border-bottom">
      <Col md={2}>
        <img 
          src={item.imagen} 
          alt={item.nombre}
          className="img-fluid rounded"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMkU4QjU3Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2VuPC90ZXh0Pgo8L3N2Zz4K';
          }}
        />
      </Col>
      
      <Col md={4}>
        <h6 className="mb-1">{item.nombre}</h6>
        <Badge bg="success" className="mb-1">{item.categoria}</Badge>
        {stockReal < item.stock_critico && (
          <Badge bg="warning" text="dark" className="ms-1">
            ⚠️ Stock Bajo
          </Badge>
        )}
      </Col>
      
      <Col md={2}>
        <div className="text-center">
          <span className="fw-bold text-success">
            ${item.precio.toLocaleString('es-CL')}
          </span>
        </div>
      </Col>
      
      <Col md={2}>
        <div className="d-flex align-items-center justify-content-center">
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => handleQuantityChange(item.cantidad - 1)}
            disabled={item.cantidad <= 1}
          >
            -
          </Button>
          
          <Form.Control
            type="number"
            value={item.cantidad}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
            min="1"
            max={stockReal}
            className="mx-2 text-center"
            style={{ width: '70px' }}
          />
          
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => handleQuantityChange(item.cantidad + 1)}
            disabled={item.cantidad >= stockReal}
          >
            +
          </Button>
        </div>
        <div className="text-center small text-muted mt-1">
          Stock disponible: {stockReal}
        </div>
      </Col>
      
      <Col md={1}>
        <div className="text-center fw-bold">
          ${subtotal.toLocaleString('es-CL')}
        </div>
      </Col>
      
      <Col md={1}>
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={() => onRemove(item.codigo)}
          title="Eliminar producto"
        >
          🗑️
        </Button>
      </Col>
    </Row>
  );
};

export default CartItem;