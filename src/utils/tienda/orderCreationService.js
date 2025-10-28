// src/utils/tienda/orderCreationService.js
import { loadFromLocalstorage, saveLocalstorage } from '../localstorageHelper';

const ORDENES_KEY = 'app_ordenes';

export const orderCreationService = {
  // ✅ GENERAR NÚMERO DE ORDEN AUTOMÁTICO
  generateOrderNumber: () => {
    const ordenes = orderCreationService.getOrdenes();
    
    if (ordenes.length === 0) {
      return 'SO1001'; // Primera orden
    }

    // Encontrar el número más alto
    const lastOrder = ordenes.reduce((max, orden) => {
      const currentNum = parseInt(orden.numeroOrden.replace('SO', ''));
      const maxNum = parseInt(max.numeroOrden.replace('SO', ''));
      return currentNum > maxNum ? orden : max;
    }, ordenes[0]);

    // Incrementar en 1
    const lastNumber = parseInt(lastOrder.numeroOrden.replace('SO', ''));
    const newNumber = lastNumber + 1;
    
    return `SO${newNumber}`;
  },

  // ✅ OBTENER FECHA ACTUAL EN FORMATO DD/MM/YYYY
  getCurrentDate: () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  },

  // ✅ CREAR NUEVA ORDEN
  createOrder: (user, cartItems, total, discountCode = '', paymentData = null) => {
    const nuevaOrden = {
      numeroOrden: orderCreationService.generateOrderNumber(),
      fecha: orderCreationService.getCurrentDate(),
      run: user.id, // El run del usuario está en user.id según authService
      estadoEnvio: 'Pendiente',
      total: total,
      productos: cartItems.map(item => ({
        codigo: item.codigo,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio
      })),
      // Información adicional
      descuentoAplicado: discountCode || '',
      metodoPago: 'Tarjeta de Crédito',
      transaccionId: paymentData?.transactionId || '',
      fechaPago: paymentData?.timestamp ? new Date(paymentData.timestamp).toLocaleDateString('es-CL') : orderCreationService.getCurrentDate()
    };

    return nuevaOrden;
  },

  // ✅ GUARDAR ORDEN EN LOCALSTORAGE
  saveOrder: (orden) => {
    try {
      const ordenes = orderCreationService.getOrdenes();
      ordenes.push(orden);
      saveLocalstorage(ORDENES_KEY, ordenes);
      
      console.log('✅ Orden guardada:', orden.numeroOrden);
      return true;
    } catch (error) {
      console.error('❌ Error al guardar orden:', error);
      return false;
    }
  },

  // ✅ OBTENER TODAS LAS ÓRDENES (para uso interno de este servicio)
  getOrdenes: () => {
    try {
      const ordenes = loadFromLocalstorage(ORDENES_KEY);
      return ordenes || [];
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      return [];
    }
  },

  // ✅ OBTENER ÓRDENES POR USUARIO (para uso interno)
  getOrdersByUser: (run) => {
    const ordenes = orderCreationService.getOrdenes();
    return ordenes.filter(orden => orden.run === run);
  },

  // ✅ ACTUALIZAR ESTADO DE ORDEN
  updateOrderStatus: (numeroOrden, nuevoEstado) => {
    try {
      const ordenes = orderCreationService.getOrdenes();
      const ordenIndex = ordenes.findIndex(orden => orden.numeroOrden === numeroOrden);
      
      if (ordenIndex !== -1) {
        ordenes[ordenIndex].estadoEnvio = nuevoEstado;
        ordenes[ordenIndex].fechaActualizacion = orderCreationService.getCurrentDate();
        saveLocalstorage(ORDENES_KEY, ordenes);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      return false;
    }
  }
};

export default orderCreationService;