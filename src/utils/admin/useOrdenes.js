// src/utils/admin/useOrdenes.js - VERIFICAR que handleDelete esté definido
import { useState, useEffect } from 'react';
import { ordenService } from './ordenService';
import { calcularEstadisticasOrdenes, aplicarFiltrosOrdenes } from './ordenStats';

export const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrden, setEditingOrden] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtros, setFiltros] = useState({
    numeroOrden: '',
    run: '',
    estado: '',
    fecha: ''
  });

  useEffect(() => {
    loadOrdenes();
  }, []);

  useEffect(() => {
    const filtered = aplicarFiltrosOrdenes(ordenes, filtros);
    setOrdenesFiltradas(filtered);
  }, [ordenes, filtros]);

  const loadOrdenes = async () => {
    try {
      setLoading(true);
      const data = await ordenService.getOrdenes();
      setOrdenes(data);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (orden) => {
    setEditingOrden(orden);
    setShowModal(true);
  };

  const handleUpdateEstado = async (numeroOrden, nuevoEstado) => {
    try {
      await ordenService.updateEstadoOrden(numeroOrden, nuevoEstado);
      await loadOrdenes();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      throw error;
    }
  };

  // ✅ Asegurar que esta función esté definida
  const handleDelete = async (numeroOrden) => {
    try {
      await ordenService.deleteOrden(numeroOrden);
      await loadOrdenes(); // Recargar la lista
      return { success: true };
    } catch (error) {
      console.error('Error eliminando orden:', error);
      return { success: false, error: error.message };
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrden(null);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      numeroOrden: '',
      run: '',
      estado: '',
      fecha: ''
    });
  };

  const refreshData = () => {
    loadOrdenes();
  };

  const estadisticas = calcularEstadisticasOrdenes(ordenes);

  return {
    // Estados
    ordenes,
    ordenesFiltradas,
    loading,
    editingOrden,
    showModal,
    filtros,
    estadisticas,
    
    // Acciones - ✅ Asegurar que handleDelete esté en el return
    handleEdit,
    handleUpdateEstado,
    handleDelete, // ✅ ESTA LÍNEA DEBE ESTAR PRESENTE
    handleCloseModal,
    handleFiltroChange,
    handleLimpiarFiltros,
    refreshData,
    
    // Aliases para consistencia
    onEdit: handleEdit,
    onUpdate: handleUpdateEstado,
    onDelete: handleDelete, // ✅ Y este alias también
    onCloseModal: handleCloseModal
  };
};