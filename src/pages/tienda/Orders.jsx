import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Table, Button } from 'react-bootstrap';
import { orderService } from '../utils/orderService';
import { authService } from '../utils/tienda/authService';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const userOrders = orderService.getUserOrders(currentUser.id);
      setOrders(userOrders);
    }
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pendiente': return 'warning';
      case 'procesando': return 'info';
      case 'enviado': return 'primary';
      case 'entregado': return 'success';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  if (!user) {
    return (
      <Container className="text-center py-5">
        <div className="navbar-spacer"></div>
        <h3>Debes iniciar sesión para ver tus pedidos</h3>
        <Button as={Link} to="/login" variant="primary" className="mt-3">
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  return (
    <div className="orders-page">
      <div className="navbar-spacer"></div>
      
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="page-title">📦 Mis Pedidos</h1>
            <p className="text-muted">
              Revisa el estado de tus compras realizadas
            </p>
          </Col>
        </Row>

        {orders.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <div className="display-1 mb-3">📭</div>
              <h4>No tienes pedidos realizados</h4>
              <p className="text-muted mb-4">
                ¡Descubre nuestros productos y realiza tu primera compra!
              </p>
              <Button as={Link} to="/productos" variant="warning" size="lg">
                Comprar Ahora
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col>
              {orders.map(order => (
                <Card key={order.id} className="mb-4 shadow-sm">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Orden #{order.id}</strong>
                      <small className="text-muted ms-2">
                        {new Date(order.fecha).toLocaleDateString('es-CL')}
                      </small>
                    </div>
                    <Badge bg={getStatusVariant(order.estado)}>
                      {order.estado.toUpperCase()}
                    </Badge>
                  </Card.Header>
                  
                  <Card.Body>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio Unitario</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map(item => (
                          <tr key={item.codigo}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={item.imagen} 
                                  alt={item.nombre}
                                  className="me-3"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/50x50/2E8B57/FFFFFF?text=Imagen';
                                  }}
                                />
                                <div>
                                  <div className="fw-bold">{item.nombre}</div>
                                  <small className="text-muted">{item.categoria}</small>
                                </div>
                              </div>
                            </td>
                            <td>{item.cantidad}</td>
                            <td>${item.precio.toLocaleString('es-CL')}</td>
                            <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <strong>Total: ${order.total.toLocaleString('es-CL')}</strong>
                      </div>
                      <Button variant="outline-primary" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Orders;