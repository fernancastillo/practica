// utils/admin/ordenStats.js
export const calcularEstadisticasOrdenes = (ordenes) => {
  const totalOrdenes = ordenes.length;
  const pendientes = ordenes.filter(o => o.estadoEnvio === 'Pendiente').length;
  const enviadas = ordenes.filter(o => o.estadoEnvio === 'Enviado').length;
  const entregadas = ordenes.filter(o => o.estadoEnvio === 'Entregado').length;
  const canceladas = ordenes.filter(o => o.estadoEnvio === 'Cancelado').length;
  const ingresosTotales = ordenes
    .filter(o => o.estadoEnvio === 'Entregado')
    .reduce((sum, orden) => sum + orden.total, 0);

  return {
    totalOrdenes,
    pendientes,
    enviadas,
    entregadas,
    canceladas,
    ingresosTotales
  };
};

export const aplicarFiltrosOrdenes = (ordenes, filtros) => {
  let filtered = [...ordenes];

  if (filtros.numeroOrden) {
    filtered = filtered.filter(orden => 
      orden.numeroOrden.toLowerCase().includes(filtros.numeroOrden.toLowerCase())
    );
  }

  if (filtros.run) {
    filtered = filtered.filter(orden => 
      orden.run.includes(filtros.run)
    );
  }

  if (filtros.estado) {
    filtered = filtered.filter(orden => 
      orden.estadoEnvio === filtros.estado
    );
  }

  if (filtros.fecha) {
    filtered = filtered.filter(orden => 
      orden.fecha === filtros.fecha
    );
  }

  return filtered;
};