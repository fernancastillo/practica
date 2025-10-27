// src/utils/admin/boletaUtils.js
import { formatCurrency, formatDate } from './dashboardUtils';
import { generarHTMLBoleta } from './boletaTemplates';
import { descargarArchivo } from './reportUtils';

/**
 * Genera una boleta en formato HTML que se puede imprimir
 */
export const generarBoletaOrden = (orden) => {
  try {
    const contenidoHTML = generarHTMLBoleta(orden);
    descargarArchivo(contenidoHTML, `boleta_${orden.numeroOrden}.html`, 'text/html');
    return true;
  } catch (error) {
    console.error('Error al generar boleta HTML:', error);
    throw new Error('No se pudo generar la boleta en formato HTML');
  }
};

/**
 * Genera boleta en formato CSV (alternativa funcional)
 */
export const generarBoletaCSV = (orden) => {
  try {
    const headers = [
      'JUNIMO STORE - BOLETA ELECTRÓNICA',
      `Número: ${orden.numeroOrden}`,
      `Fecha: ${formatDate(orden.fecha)}`, 
      `RUN Cliente: ${orden.run}`,
      `Estado: ${orden.estadoEnvio}`,
      ''
    ];
    
    const productosHeaders = ['Código', 'Producto', 'Cantidad', 'Precio Unitario', 'Subtotal'];
    
    const productosRows = orden.productos.map(producto => [
      producto.codigo,
      `"${producto.nombre}"`,
      producto.cantidad,
      formatCurrency(producto.precio),
      formatCurrency(producto.precio * producto.cantidad)
    ]);
    
    const totalRow = ['', '', '', 'TOTAL:', formatCurrency(orden.total)];
    const footer = [
      '',
      '¡Gracias por su compra en Junimo Store!',
      'Tienda Oficial de Stardew Valley',
      `Boleta generada el ${new Date().toLocaleDateString('es-CL')}`
    ];
    
    const contenido = [
      ...headers,
      'DETALLES DE PRODUCTOS:',
      productosHeaders.join(','),
      ...productosRows.map(row => row.join(',')),
      totalRow.join(','),
      ...footer
    ].join('\n');

    descargarArchivo('\uFEFF' + contenido, `boleta_${orden.numeroOrden}.csv`, 'text/csv;charset=utf-8');
    return true;
  } catch (error) {
    console.error('Error al generar boleta CSV:', error);
    throw new Error('No se pudo generar la boleta en formato CSV');
  }
};

/**
 * Genera boleta en formato de texto plano
 */
export const generarBoletaTexto = (orden) => {
  try {
    const contenido = `
JUNIMO STORE
Tienda Oficial de Stardew Valley
=================================

BOLETA ELECTRÓNICA
N°: ${orden.numeroOrden}
Fecha: ${formatDate(orden.fecha)}
RUN Cliente: ${orden.run}
Estado: ${orden.estadoEnvio}

DETALLES DE PRODUCTOS:
${orden.productos.map(producto => 
  `• ${producto.codigo} - ${producto.nombre}
   Cantidad: ${producto.cantidad} x ${formatCurrency(producto.precio)} = ${formatCurrency(producto.precio * producto.cantidad)}`
).join('\n\n')}

=================================
TOTAL: ${formatCurrency(orden.total)}

¡Gracias por su compra en Junimo Store!
Boleta generada el ${new Date().toLocaleDateString('es-CL')}
    `.trim();

    descargarArchivo(contenido, `boleta_${orden.numeroOrden}.txt`, 'text/plain');
    return true;
  } catch (error) {
    console.error('Error al generar boleta texto:', error);
    throw new Error('No se pudo generar la boleta en formato texto');
  }
};