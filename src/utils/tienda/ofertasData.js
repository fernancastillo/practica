// src/utils/tienda/ofertasData.js

export const ofertasConfig = [
  {
    codigo: "PE001", // Mismo código que en productos.json
    descuento: 25,   // ✅ DESCUENTO MÁS REALISTA
    tiempoRestante: "1d 6h 15m",
    exclusivo: true
  },
  {
    codigo: "DE001",
    descuento: 30,   // ✅ DESCUENTO MÁS REALISTA
    tiempoRestante: "2d 4h 20m",
    exclusivo: false
  },
  {
    codigo: "PP001",
    descuento: 20,   // ✅ DESCUENTO MÁS REALISTA
    tiempoRestante: "3d 12h 30m",
    exclusivo: true
  },
  {
    codigo: "DE002",
    descuento: 35,   // ✅ DESCUENTO MÁS REALISTA
    tiempoRestante: "5d 18h 45m",
    exclusivo: false
  }
];

// Función para aplicar ofertas a productos existentes
export const aplicarOfertasAProductos = (productos) => {
  return productos.map(producto => {
    const ofertaConfig = ofertasConfig.find(oferta => oferta.codigo === producto.codigo);
    
    if (ofertaConfig) {
      const precioOferta = producto.precio * (1 - ofertaConfig.descuento / 100);
      
      return {
        ...producto,
        precioOriginal: producto.precio, // Guardar precio original
        precioOferta: Math.round(precioOferta), // Precio con descuento
        descuento: ofertaConfig.descuento,
        tiempoRestante: ofertaConfig.tiempoRestante,
        exclusivo: ofertaConfig.exclusivo,
        enOferta: true // Flag para identificar que está en oferta
      };
    }
    
    return producto;
  }).filter(producto => producto.enOferta); // Solo mostrar productos en oferta
};