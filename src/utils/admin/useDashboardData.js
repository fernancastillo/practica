// src/utils/admin/useDashboardData.js
import { useState, useEffect } from 'react';
import { dataService } from '../dataService';

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalProductos: 0,
    totalOrdenes: 0,
    ordenesPendientes: 0,
    ordenesEntregadas: 0,
    ingresosTotales: 0
  });

  const [productosStockCritico, setProductosStockCritico] = useState([]);
  const [ultimasOrdenes, setUltimasOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const usuarios = dataService.getUsuarios();
    const productos = dataService.getProductos();
    const ordenes = dataService.getOrdenes();

    const ordenesPendientes = ordenes.filter(o => o.estadoEnvio === 'Pendiente').length;
    const ordenesEntregadas = ordenes.filter(o => o.estadoEnvio === 'Entregado').length;
    
    // SOLO sumar órdenes entregadas (para consistencia con órdenes/usuarios)
    const ingresosTotales = ordenes
      .filter(o => o.estadoEnvio === 'Entregado')
      .reduce((total, orden) => total + orden.total, 0);

    setStats({
      totalUsuarios: usuarios.length,
      totalProductos: productos.length,
      totalOrdenes: ordenes.length,
      ordenesPendientes,
      ordenesEntregadas,
      ingresosTotales // Ahora solo órdenes entregadas
    });

    const stockCritico = productos.filter(p => p.stock <= p.stock_critico);
    setProductosStockCritico(stockCritico);

    const ordenesOrdenadas = [...ordenes]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5);
    setUltimasOrdenes(ordenesOrdenadas);

    setLoading(false);
  };

  return {
    stats,
    productosStockCritico,
    ultimasOrdenes,
    loading,
    refreshData: loadDashboardData
  };
};