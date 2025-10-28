import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { orderService } from '../../utils/tienda/orderService';
import { authService } from '../../utils/tienda/authService';
import { Link } from 'react-router-dom';
import PedidosHeader from '../../components/tienda/PedidosHeader';
import EmptyOrders from '../../components/tienda/EmptyOrders';
import OrderCard from '../../components/tienda/OrderCard';

const Pedidos = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    console.log('👤 Usuario actual:', currentUser);
    setUser(currentUser);
    
    if (currentUser) {
      const userRun = currentUser.run;
      console.log('🔍 Buscando órdenes para RUN:', userRun);
      
      if (userRun) {
        const userOrders = orderService.getUserOrders(userRun);
        console.log('📦 Órdenes encontradas:', userOrders);
        
        // ✅ ORDENAR: De más reciente a más antigua
        const sortedOrders = userOrders
          .map(order => ({
            ...order,
            productos: order.productos || []
          }))
          .sort((a, b) => {
            // Convertir fechas DD/MM/YYYY a formato comparable
            const dateA = a.fecha.split('/').reverse().join('-');
            const dateB = b.fecha.split('/').reverse().join('-');
            return new Date(dateB) - new Date(dateA);
          });
        
        setOrders(sortedOrders);
      } else {
        console.error('❌ No se encontró RUN del usuario');
        setOrders([]);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
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
        <div className="navbar-spacer"></div>
        <Container className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando tus pedidos...</p>
        </Container>
      </div>
    );
  }

  if (!user) {
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
        <div className="navbar-spacer"></div>
        <Container className="text-center py-5">
          <h3>Debes iniciar sesión para ver tus pedidos</h3>
          <Button as={Link} to="/login" variant="primary" className="mt-3">
            Iniciar Sesión
          </Button>
        </Container>
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
      <div className="navbar-spacer"></div>
      
      <Container className="py-4">
        {/* Header Component */}
        <PedidosHeader />
        
        {/* Contenido Principal */}
        {orders.length === 0 ? (
          <EmptyOrders user={user} />
        ) : (
          <Row>
            <Col>
              {orders.map(order => (
                <OrderCard 
                  key={order.numeroOrden} 
                  order={order} 
                />
              ))}
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Pedidos;