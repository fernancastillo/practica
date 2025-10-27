// src/utils/admin/boletaTemplates.js
import { formatCurrency, formatDate } from './dashboardUtils';

/**
 * Genera el HTML completo para la boleta
 */
export const generarHTMLBoleta = (orden) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Boleta - ${orden.numeroOrden}</title>
        <style>
            ${generarEstilosBoleta()}
        </style>
    </head>
    <body>
        ${generarContenidoBoleta(orden)}
    </body>
    </html>
  `;
};

/**
 * Genera los estilos CSS para la boleta
 */
const generarEstilosBoleta = () => {
  return `
    body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 20px;
        color: #333;
    }
    .boleta-container {
        max-width: 800px;
        margin: 0 auto;
        border: 2px solid #333;
        padding: 20px;
        background-color: #fff;
    }
    .header {
        text-align: center;
        border-bottom: 2px solid #333;
        padding-bottom: 15px;
        margin-bottom: 20px;
    }
    .logo {
        font-size: 24px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 5px;
    }
    .subtitle {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 10px;
    }
    .info-section {
        margin-bottom: 20px;
    }
    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
    }
    .info-item {
        margin-bottom: 8px;
    }
    .info-label {
        font-weight: bold;
        color: #2c3e50;
    }
    .table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    .table th {
        background-color: #34495e;
        color: white;
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd;
    }
    .table td {
        padding: 10px;
        border: 1px solid #ddd;
    }
    .table tbody tr:nth-child(even) {
        background-color: #f8f9fa;
    }
    .total-section {
        text-align: right;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 2px solid #333;
    }
    .total-amount {
        font-size: 18px;
        font-weight: bold;
        color: #27ae60;
    }
    .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        font-size: 12px;
        color: #7f8c8d;
    }
    .status-badge {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 15px;
        font-weight: bold;
        font-size: 12px;
    }
    .status-pendiente { background-color: #f39c12; color: black; }
    .status-enviado { background-color: #3498db; color: white; }
    .status-entregado { background-color: #27ae60; color: white; }
    .status-cancelado { background-color: #e74c3c; color: white; }
  `;
};

/**
 * Genera el contenido HTML de la boleta
 */
const generarContenidoBoleta = (orden) => {
  return `
    <div class="boleta-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">JUNIMO STORE</div>
            <div class="subtitle">Tienda Oficial de Stardew Valley</div>
            <h1>BOLETA ELECTRÓNICA</h1>
            <div class="subtitle">N° ${orden.numeroOrden}</div>
        </div>

        <!-- Información de la orden -->
        <div class="info-section">
            <div class="info-grid">
                <div>
                    <div class="info-item">
                        <span class="info-label">Fecha de Emisión:</span> ${formatDate(orden.fecha)}
                    </div>
                    <div class="info-item">
                        <span class="info-label">RUN Cliente:</span> ${orden.run}
                    </div>
                </div>
                <div>
                    <div class="info-item">
                        <span class="info-label">Estado:</span> 
                        <span class="status-badge status-${orden.estadoEnvio.toLowerCase()}">
                            ${orden.estadoEnvio}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detalles de productos -->
        <table class="table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${generarFilasProductos(orden.productos)}
            </tbody>
        </table>

        <!-- Total -->
        <div class="total-section">
            <div class="total-amount">
                TOTAL: ${formatCurrency(orden.total)}
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>¡Gracias por su compra en Junimo Store!</p>
            <p>Para consultas o soporte, contacte a nuestro servicio al cliente</p>
            <p>Boleta generada el ${new Date().toLocaleDateString('es-CL')}</p>
        </div>
    </div>
  `;
};

/**
 * Genera las filas de la tabla de productos
 */
const generarFilasProductos = (productos) => {
  return productos.map(producto => `
    <tr>
        <td>${producto.codigo}</td>
        <td>${producto.nombre}</td>
        <td>${producto.cantidad}</td>
        <td>${formatCurrency(producto.precio)}</td>
        <td>${formatCurrency(producto.precio * producto.cantidad)}</td>
    </tr>
  `).join('');
};