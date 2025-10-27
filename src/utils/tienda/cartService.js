// src/utils/tienda/cartService.js

const CART_KEY = 'junimoCart';
const PRODUCTOS_KEY = 'app_productos';

export const cartService = {
  // ✅ OBTENER CARRITO
  getCart: () => {
    try {
      const cartJSON = localStorage.getItem(CART_KEY);
      return cartJSON ? JSON.parse(cartJSON) : [];
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return [];
    }
  },

  // ✅ GUARDAR CARRITO
  saveCart: (cartItems) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
      return true;
    } catch (error) {
      console.error('Error al guardar carrito:', error);
      return false;
    }
  },

  // ✅ CALCULAR ENVÍO
  calculateShipping: (subtotal) => {
    // Envío gratis sobre $30.000, costo de $3.990 si es menor o igual
    return subtotal > 30000 ? 0 : 3990;
  },

  // ✅ VERIFICAR DESCUENTO DUOC
  hasDuocDiscount: (user) => {
    if (!user || !user.email) return false;
    
    const email = user.email.toLowerCase();
    return email.endsWith('@duoc.cl') || email.endsWith('@duocuc.cl');
  },

  // ✅ CALCULAR DESCUENTO DUOC
  calculateDuocDiscount: (subtotal) => {
    // 20% de descuento para estudiantes DUOC
    return Math.round(subtotal * 0.2);
  },

  // ✅ CALCULAR TOTAL FINAL
  calculateFinalTotal: (subtotal, envio, descuento = 0) => {
    return Math.max(0, subtotal - descuento + envio);
  },

  // ✅ VERIFICAR STOCK DISPONIBLE
  checkAvailableStock: (productoCodigo, cantidadDeseada) => {
    try {
      const productos = JSON.parse(localStorage.getItem(PRODUCTOS_KEY)) || [];
      const producto = productos.find(p => p.codigo === productoCodigo);
      
      if (!producto) return false;
      
      // Verificar que la cantidad deseada no supere el stock real
      return cantidadDeseada <= producto.stock;
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return false;
    }
  },

  // ✅ ACTUALIZAR STOCK RESERVADO
  updateReservedStock: (carritoActual) => {
    try {
      const productos = JSON.parse(localStorage.getItem(PRODUCTOS_KEY)) || [];
      
      const productosActualizados = productos.map(producto => {
        const itemEnCarrito = carritoActual.find(item => item.codigo === producto.codigo);
        return {
          ...producto,
          stock_reservado: itemEnCarrito ? itemEnCarrito.cantidad : 0
        };
      });
      
      localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productosActualizados));
      return productosActualizados;
    } catch (error) {
      console.error('Error al actualizar stock reservado:', error);
      return [];
    }
  },

  // ✅ ACTUALIZAR CANTIDAD (MEJORADO)
  updateQuantity: (productCode, newQuantity) => {
    try {
      const cartItems = cartService.getCart();
      
      // Si la cantidad es 0, no eliminar el producto, mantenerlo en 1
      const safeQuantity = newQuantity === 0 ? 1 : Math.max(1, newQuantity);
      
      const updatedCart = cartItems.map(item =>
        item.codigo === productCode
          ? { ...item, cantidad: safeQuantity }
          : item
      );

      cartService.saveCart(updatedCart);
      cartService.updateReservedStock(updatedCart);
      
      return updatedCart;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return cartService.getCart();
    }
  },

  // ✅ ELIMINAR PRODUCTO
  removeItem: (productCode) => {
    try {
      const cartItems = cartService.getCart();
      const updatedCart = cartItems.filter(item => item.codigo !== productCode);
      
      cartService.saveCart(updatedCart);
      cartService.updateReservedStock(updatedCart);
      
      return updatedCart;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return cartService.getCart();
    }
  },

  // ✅ CALCULAR TOTAL (solo productos)
  calculateTotal: (cartItems = null) => {
    const items = cartItems || cartService.getCart();
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  },

  // ✅ VACIAR CARRITO
  clearCart: () => {
    try {
      localStorage.removeItem(CART_KEY);
      cartService.updateReservedStock([]);
      return true;
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      return false;
    }
  },

  // ✅ PROCESAR CHECKOUT
  processCheckout: (cartItems, totalFinal) => {
    try {
      // Actualizar stock real en productos
      const productos = JSON.parse(localStorage.getItem(PRODUCTOS_KEY)) || [];
      const productosActualizados = productos.map(producto => {
        const itemEnCarrito = cartItems.find(item => item.codigo === producto.codigo);
        if (itemEnCarrito) {
          return {
            ...producto,
            stock: Math.max(0, producto.stock - itemEnCarrito.cantidad)
          };
        }
        return producto;
      });
      
      localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productosActualizados));
      
      // Aquí podrías guardar la orden con el total final
      console.log('✅ Checkout procesado. Total final:', totalFinal);
      
      return productosActualizados;
    } catch (error) {
      console.error('Error en checkout:', error);
      throw error;
    }
  },

  // ✅ AGREGAR PRODUCTO AL CARRITO
  addToCart: (producto, cantidad = 1) => {
    try {
      const cartItems = cartService.getCart();
      
      // Verificar stock disponible
      if (!cartService.checkAvailableStock(producto.codigo, cantidad)) {
        throw new Error('No hay suficiente stock disponible');
      }

      const existingItemIndex = cartItems.findIndex(item => item.codigo === producto.codigo);
      
      if (existingItemIndex !== -1) {
        // Actualizar cantidad si ya existe
        cartItems[existingItemIndex].cantidad += cantidad;
      } else {
        // Agregar nuevo producto
        cartItems.push({
          ...producto,
          cantidad: cantidad
        });
      }
      
      cartService.saveCart(cartItems);
      cartService.updateReservedStock(cartItems);
      
      return cartItems;
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      throw error;
    }
  },

  // ✅ OBTENER CANTIDAD TOTAL DE PRODUCTOS
  getTotalItems: () => {
    const cartItems = cartService.getCart();
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  }
};