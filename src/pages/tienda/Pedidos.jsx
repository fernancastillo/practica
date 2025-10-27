import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import { authService } from '../../utils/tienda/authService'; // Ajusta la ruta
import { orderService } from '../../utils/tienda/orderService'; // Ajusta la ruta

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      // Cargar pedidos usando orderService
      const userOrders = orderService.getUserOrders(currentUser.id);
      setPedidos(userOrders);
    }
  }, []);

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'entregado': return <Badge bg="success">Entregado</Badge>;
      case 'enviado': return <Badge bg="warning">En camino</Badge>;
      case 'procesando': return <Badge bg="info">Procesando</Badge>;
      case 'pendiente': return <Badge bg="secondary">Pendiente</Badge>;
      default: return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="pedidos-page">
        <div className="navbar-spacer"></div>
        <Container className="py-5">
          <Alert variant="warning">
            <h5>Debes iniciar sesión para ver tus pedidos</h5>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="pedidos-page">
      <div className="navbar-spacer"></div>
      <Container className="py-5">
        <Row>
          <Col>
            <h1 className="text-white mb-4">📦 Mis Pedidos</h1>
            
            {pedidos.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-5">
                  <Alert variant="info">
                    <h5>No tienes pedidos realizados</h5>
                    <p className="mb-0">Cuando realices una compra, aparecerá aquí tu historial de pedidos.</p>
                  </Alert>
                </Card.Body>
              </Card>
            ) : (
              <Card>
                <Card.Body>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Pedido #</th>
                        <th>Fecha</th>
                        <th>Productos</th>
                        <th>Cantidad Total</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                          <td>
                            <strong>#{pedido.id}</strong>
                          </td>
                          <td>{formatearFecha(pedido.fecha)}</td>
                          <td>
                            <div>
                              {pedido.items.map((producto, index) => (
                                <div key={index} className="small">
                                  • {producto.nombre}
                                  {producto.cantidad > 1 && ` (x${producto.cantidad})`}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            {pedido.items.reduce((total, producto) => total + producto.cantidad, 0)} items
                          </td>
                          <td className="fw-bold text-success">
                            {formatearPrecio(pedido.total)}
                          </td>
                          <td>{getEstadoBadge(pedido.estado)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Pedidos;