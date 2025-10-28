import { getProductosConStockActual } from './stockService';
import { getProductosConOfertas } from './ofertasService';

// Función para calcular porcentaje de descuento
export const calcularPorcentajeDescuento = (precioOriginal, precioOferta) => {
  if (!precioOriginal || !precioOferta || precioOriginal <= precioOferta) {
    return 0;
  }
  
  const descuento = ((precioOriginal - precioOferta) / precioOriginal) * 100;
  return Math.round(descuento);
};

// Función para cargar categorías y productos
export const loadCategoriesAndProducts = () => {
  try {
    // Obtener productos con stock y ofertas
    const productosConStock = getProductosConStockActual();
    const productosConOfertas = getProductosConOfertas();
    
    // Combinar productos con ofertas aplicadas
    const productosFinales = productosConStock.map(productoStock => {
      const productoConOferta = productosConOfertas.find(p => p.codigo === productoStock.codigo);
      return productoConOferta || productoStock;
    });

    // Obtener categorías únicas de los productos
    const categoriasUnicas = [...new Set(productosFinales.map(product => product.categoria))];
    
    // Crear array de categorías con información adicional
    const categoriasConInfo = categoriasUnicas.map(categoria => {
      const productosCategoria = productosFinales.filter(product => product.categoria === categoria);
      return {
        nombre: categoria,
        cantidadProductos: productosCategoria.length,
        productos: productosCategoria
      };
    });

    console.log('📂 Categorías cargadas:', categoriasConInfo.length);
    return categoriasConInfo;
    
  } catch (error) {
    console.error('💥 Error cargando categorías:', error);
    return [];
  }
};

// Función para obtener productos por categoría
export const getProductosPorCategoria = (categoriaNombre, categorias) => {
  const categoria = categorias.find(cat => cat.nombre === categoriaNombre);
  return categoria ? categoria.productos : [];
};