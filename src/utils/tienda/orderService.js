// src/utils/orderService.js
export const orderService = {
  // Obtener todas las órdenes
  getAllOrders: () => {
    try {
      const orders = localStorage.getItem('app_ordenes');
      const parsedOrders = orders ? JSON.parse(orders) : [];
      console.log('📊 Total de órdenes en sistema:', parsedOrders.length);
      return parsedOrders;
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      return [];
    }
  },

  // Obtener órdenes de un usuario específico por RUN
  getUserOrders: (userRun) => {
    try {
      const orders = orderService.getAllOrders();
      console.log('🔍 Buscando órdenes para RUN:', userRun);
      
      if (!userRun) {
        console.error('❌ RUN del usuario no proporcionado');
        return [];
      }
      
      // Buscar órdenes que coincidan con el RUN del usuario
      const userOrders = orders.filter(order => {
        const match = order.run === userRun;
        if (match) {
          console.log('✅ Orden encontrada:', order.numeroOrden);
        }
        return match;
      });
      
      console.log('📦 Órdenes encontradas para el usuario:', userOrders.length);
      return userOrders;
    } catch (error) {
      console.error('Error al obtener órdenes del usuario:', error);
      return [];
    }
  },

  // Obtener orden por número de orden
  getOrderByNumber: (orderNumber) => {
    const orders = orderService.getAllOrders();
    return orders.find(order => order.numeroOrden === orderNumber);
  }
};