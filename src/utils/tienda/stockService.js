// src/utils/tienda/stockService.js

// 🔄 Obtener productos actualizados con stock real desde el carrito
export const getProductosConStockActual = () => {
  try {
    const carrito = JSON.parse(localStorage.getItem('junimoCart')) || [];
    const productosBase = JSON.parse(localStorage.getItem('app_productos')) || [];

    const productosConStockActual = productosBase.map(producto => {
      // ✅ SIEMPRE usar el stock original como base, NO stock_disponible
      const stockBase = producto.stock; // ← Stock original del producto

      // Buscar si ese producto está en el carrito
      const itemEnCarrito = carrito.find(item => item.codigo === producto.codigo);
      const stockReservado = itemEnCarrito ? itemEnCarrito.cantidad : 0;

      // Calcular nuevo stock disponible
      const stock_disponible = Math.max(0, stockBase - stockReservado);

      return {
        ...producto,
        stock_disponible // ✅ Este es calculado en tiempo real
      };
    });

    return productosConStockActual;
  } catch (error) {
    console.error('❌ Error al calcular stock:', error);
    return [];
  }
};

// 🔍 Verificar si hay stock suficiente para agregar al carrito
export const verificarStockDisponible = (productoCodigo, cantidadDeseada = 1) => {
  const productos = getProductosConStockActual();
  const producto = productos.find(p => p.codigo === productoCodigo);
  return producto ? producto.stock_disponible >= cantidadDeseada : false;
};

// 🧮 Actualizar productos en localStorage con stock actualizado
export const actualizarStockEnProductos = () => {
  const productosActualizados = getProductosConStockActual();
  
  // ✅ Guardar en localStorage para mantener consistencia
  localStorage.setItem('app_productos', JSON.stringify(productosActualizados));
  
  // ✅ Disparar evento para notificar a todos los componentes
  window.dispatchEvent(new Event('stockUpdated'));
  
  return productosActualizados;
};

// 🔄 Función para reiniciar stock completamente (cuando se vacía el carrito)
export const reiniciarStockDesdeBase = () => {
  try {
    // Cargar productos base desde el JSON original
    import('../../data/productos.json')
      .then(productosData => {
        const productosBase = productosData.default;
        
        // Guardar productos base en localStorage (sin stock_disponible)
        localStorage.setItem('app_productos', JSON.stringify(productosBase));
        
        // Disparar eventos para actualizar todos los componentes
        window.dispatchEvent(new Event('stockUpdated'));
        window.dispatchEvent(new Event('cartUpdated'));
        
        console.log('✅ Stock reiniciado desde base de datos');
      })
      .catch(error => {
        console.error('❌ Error cargando productos base:', error);
      });
  } catch (error) {
    console.error('❌ Error reiniciando stock:', error);
  }
};