import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Badge, Modal } from 'react-bootstrap';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [stockReal, setStockReal] = useState(item.stock);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quantityInput, setQuantityInput] = useState(item.cantidad.toString());

  // Sincronizar quantityInput cuando cambia la cantidad del item
  useEffect(() => {
    setQuantityInput(item.cantidad.toString());
  }, [item.cantidad]);

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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuantityInput(value);
    
    // Si el input está vacío, no hacer nada (mantener el valor anterior)
    if (value === '') {
      return;
    }
    
    const newQuantity = parseInt(value) || 0;
    
    // Validar que la cantidad sea válida
    if (newQuantity >= 0 && newQuantity <= stockReal) {
      onUpdateQuantity(item.codigo, newQuantity);
    } else if (newQuantity > stockReal) {
      alert(`❌ Solo hay ${stockReal} unidades disponibles`);
      // Restaurar el valor anterior
      setQuantityInput(item.cantidad.toString());
    }
  };

  const handleInputBlur = (e) => {
    // Si el input queda vacío, restaurar la cantidad anterior
    if (e.target.value === '') {
      setQuantityInput(item.cantidad.toString());
    }
  };

  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const confirmRemove = () => {
    onRemove(item.codigo);
    setShowDeleteModal(false);
  };

  const subtotal = item.precio * item.cantidad;

  return (
    <>
      <Row 
        className="align-items-center py-3 border-bottom mx-0 rounded-4 mb-3 border-3 border-dark"
        style={{
          backgroundColor: '#87CEEB',
          transition: 'all 0.3s ease',
          fontFamily: "'Lato', sans-serif"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Col md={2}>
          <img 
            src={item.imagen} 
            alt={item.nombre}
            className="img-fluid rounded border-2 border-dark"
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'cover',
            }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjODdDRUVCIi8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZW48L3RleHQ+Cjwvc3ZnPgo=';
            }}
          />
        </Col>
        
        <Col md={3}> {/* Cambiado de md={4} a md={3} para dar más espacio */}
          <h6 
            className="mb-1 fw-bold"
            style={{ color: '#000000' }}
          >
            {item.nombre}
          </h6>
          <Badge 
            bg="success" 
            className="mb-1 border-2 border-dark"
            style={{ 
              backgroundColor: '#dedd8ff5',
              color: '#000000',
              fontFamily: "'Lato', sans-serif"
            }}
          >
            {item.categoria}
          </Badge>
          {stockReal < item.stock_critico && (
            <Badge bg="warning" text="dark" className="ms-1 border-2 border-dark">
              ⚠️ Stock Bajo
            </Badge>
          )}
        </Col>
        
        <Col md={2}>
          <div className="text-center">
            <span 
              className="fw-bold"
              style={{ 
                color: '#000000',
                fontSize: '1.1rem'
              }}
            >
              ${item.precio.toLocaleString('es-CL')}
            </span>
          </div>
        </Col>
        
        <Col md={2}>
          <div className="d-flex align-items-center justify-content-center">
            <Button 
              variant="outline-dark" 
              size="sm"
              className="border-3 fw-bold"
              style={{
                backgroundColor: '#dedd8ff5',
                color: '#000000'
              }}
              onClick={() => handleQuantityChange(item.cantidad - 1)}
              disabled={item.cantidad <= 1}
            >
              -
            </Button>
            
            <Form.Control
              type="number"
              value={quantityInput}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              min="1"
              max={stockReal}
              className="mx-2 text-center border-3 border-dark fw-bold"
              style={{ 
                width: '70px',
                color: '#000000',
                backgroundColor: '#FFFFFF'
              }}
            />
            
            <Button 
              variant="outline-dark" 
              size="sm"
              className="border-3 fw-bold"
              style={{
                backgroundColor: '#dedd8ff5',
                color: '#000000'
              }}
              onClick={() => handleQuantityChange(item.cantidad + 1)}
              disabled={item.cantidad >= stockReal}
            >
              +
            </Button>
          </div>
          <div 
            className="text-center small mt-1 fw-semibold"
            style={{ color: '#000000' }}
          >
            Stock disponible: {stockReal}
          </div>
        </Col>
        
        <Col md={2}> {/* Cambiado de md={1} a md={2} para más espacio */}
          <div 
            className="text-center fw-bold"
            style={{ 
              color: '#000000',
              fontSize: '1.1rem',
              minWidth: '100px' /* Asegura que tenga suficiente ancho */
            }}
          >
            ${subtotal.toLocaleString('es-CL')}
          </div>
        </Col>
        
        <Col md={1}>
          <Button 
            variant="outline-danger" 
            size="sm"
            className="border-3 fw-bold"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000',
              borderColor: '#dc3545',
              minWidth: '50px' /* Ancho mínimo para el botón */
            }}
            onClick={handleRemoveClick}
            title="Eliminar producto"
          >
            🗑️
          </Button>
        </Col>
      </Row>

      {/* Modal de confirmación para eliminar */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        <Modal.Header 
          closeButton
          className="border-3 border-dark"
          style={{
            backgroundColor: '#87CEEB',
          }}
        >
          <Modal.Title className="fw-bold" style={{ color: '#000000' }}>
            <span style={{ fontFamily: "'Indie Flower', cursive" }}>
              🗑️ Confirmar Eliminación
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: '#87CEEB',
          }}
        >
          <div className="text-center">
            <div className="mb-3">
              <img 
                src={item.imagen} 
                alt={item.nombre}
                className="img-fluid rounded border-3 border-dark"
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjODdDRUVCIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDAwMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZW48L3RleHQ+Cjwvc3ZnPgo=';
                }}
              />
            </div>
            <h5 
              className="fw-bold mb-3"
              style={{ 
                color: '#000000',
              }}
            >
              ¿Estás seguro de que quieres eliminar?
            </h5>
            <p 
              className="mb-3 fw-semibold"
              style={{ 
                color: '#000000',
                fontSize: '1.1rem'
              }}
            >
              "{item.nombre}"
            </p>
            <p 
              className="fw-semibold"
              style={{ color: '#000000' }}
            >
              Esta acción no se puede deshacer
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer
          className="border-3 border-dark"
          style={{
            backgroundColor: '#87CEEB',
          }}
        >
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
            style={{
              backgroundColor: '#dedd8ff5',
              color: '#000000'
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmRemove}
            className="rounded-pill px-4 py-2 border-3 border-dark fw-bold"
            style={{
              background: 'linear-gradient(135deg, #dc3545, #c82333)',
              color: '#FFFFFF',
              border: 'none'
            }}
          >
            Sí, Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartItem;