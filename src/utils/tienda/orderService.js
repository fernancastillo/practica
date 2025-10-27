export const orderService = {
  // Crear nueva orden
  createOrder: (cartItems, userInfo, total) => {
    const orders = orderService.getOrders();
    const newOrder = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      items: [...cartItems],
      total: total,
      estado: 'pendiente',
      usuario: userInfo,
      direccionEnvio: userInfo.direccion || {}
    };

    const updatedOrders = [...orders, newOrder];
    localStorage.setItem('junimoOrders', JSON.stringify(updatedOrders));
    return newOrder;
  },

  // Obtener todas las órdenes
  getOrders: () => {
    const savedOrders = localStorage.getItem('junimoOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  },

  // Obtener órdenes por usuario
  getUserOrders: (userId) => {
    const orders = orderService.getOrders();
    return orders.filter(order => order.usuario.id === userId);
  },

  // Actualizar estado de orden
  updateOrderStatus: (orderId, newStatus) => {
    const orders = orderService.getOrders();
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, estado: newStatus } : order
    );
    localStorage.setItem('junimoOrders', JSON.stringify(updatedOrders));
    return updatedOrders;
  }
};