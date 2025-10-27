// src/utils/tienda/ofertasService.js
import { ofertasConfig } from './ofertasData';

// Función para aplicar ofertas a un producto individual
export const aplicarOfertaAProducto = (producto) => {
  const ofertaConfig = ofertasConfig.find(oferta => oferta.codigo === producto.codigo);
  
  if (ofertaConfig) {
    const precioOferta = producto.precio * (1 - ofertaConfig.descuento / 100);
    
    return {
      ...producto,
      precioOriginal: producto.precio, // Guardar precio original
      precioOferta: Math.round(precioOferta), // Precio con descuento
      precio: Math.round(precioOferta), // Sobrescribir precio para mostrar oferta
      descuento: ofertaConfig.descuento,
      tiempoRestante: ofertaConfig.tiempoRestante,
      exclusivo: ofertaConfig.exclusivo,
      enOferta: true
    };
  }
  
  return producto;
};

// Función para aplicar ofertas a un array de productos
export const aplicarOfertasAProductos = (productos) => {
  return productos.map(producto => aplicarOfertaAProducto(producto));
};

// Función para obtener productos con ofertas aplicadas
export const getProductosConOfertas = () => {
  try {
    const productosStorage = localStorage.getItem('app_productos');
    if (productosStorage) {
      const productos = JSON.parse(productosStorage);
      return aplicarOfertasAProductos(productos);
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo productos con ofertas:', error);
    return [];
  }
};

// Función para verificar si un producto está en oferta
export const estaEnOferta = (codigoProducto) => {
  return ofertasConfig.some(oferta => oferta.codigo === codigoProducto);
};

// Función para obtener productos en oferta (solo los que tienen descuento)
export const getProductosEnOferta = () => {
  const productos = getProductosConOfertas();
  return productos.filter(producto => producto.enOferta);
};