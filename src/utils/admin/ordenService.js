// src/utils/admin/ordenService.js
import ordenesData from '../../data/ordenes.json';

const STORAGE_KEY = 'app_ordenes'; // Cambiar a la colección existente
const STORAGE_KEY_LEGACY = 'admin_ordenes'; // Para migración

export const ordenService = {
  async getOrdenes() {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Primero intentar obtener de app_ordenes (colección existente)
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Si no existe app_ordenes, verificar si existe admin_ordenes para migrar
    const storedLegacy = localStorage.getItem(STORAGE_KEY_LEGACY);
    if (storedLegacy) {
      // Migrar datos de admin_ordenes a app_ordenes
      const ordenes = JSON.parse(storedLegacy);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenes));
      localStorage.removeItem(STORAGE_KEY_LEGACY); // Opcional: eliminar la vieja
      console.log('Órdenes migradas de admin_ordenes a app_ordenes');
      return ordenes;
    }
    
    // Si no existe ninguna, usar datos del JSON y guardar en app_ordenes
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenesData));
    return ordenesData;
  },

  async updateEstadoOrden(numeroOrden, nuevoEstado) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ordenes = await this.getOrdenes();
    const ordenIndex = ordenes.findIndex(o => o.numeroOrden === numeroOrden);
    
    if (ordenIndex === -1) {
      throw new Error('Orden no encontrada');
    }
    
    ordenes[ordenIndex].estadoEnvio = nuevoEstado;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenes));
    
    return ordenes[ordenIndex];
  },

  async getOrdenByNumero(numeroOrden) {
    const ordenes = await this.getOrdenes();
    return ordenes.find(o => o.numeroOrden === numeroOrden);
  },

  // ✅ FUNCIÓN: Eliminar orden
  async deleteOrden(numeroOrden) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ordenes = await this.getOrdenes();
    const ordenIndex = ordenes.findIndex(o => o.numeroOrden === numeroOrden);
    
    if (ordenIndex === -1) {
      throw new Error('Orden no encontrada');
    }
    
    // Verificar que no sea una orden entregada (opcional - por seguridad)
    const orden = ordenes[ordenIndex];
    if (orden.estadoEnvio === 'Entregado') {
      throw new Error('No se puede eliminar una orden ya entregada');
    }
    
    // Eliminar la orden
    ordenes.splice(ordenIndex, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenes));
    
    return true;
  },

  // ✅ NUEVA FUNCIÓN: Crear orden
  async createOrden(ordenData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ordenes = await this.getOrdenes();
    
    // Verificar que no exista una orden con el mismo número
    const ordenExistente = ordenes.find(o => o.numeroOrden === ordenData.numeroOrden);
    if (ordenExistente) {
      throw new Error('Ya existe una orden con este número');
    }

    // Crear nueva orden con datos completos
    const nuevaOrden = {
      ...ordenData,
      // Asegurar campos requeridos
      fecha: ordenData.fecha || new Date().toISOString().split('T')[0],
      estadoEnvio: ordenData.estadoEnvio || 'Pendiente',
      productos: ordenData.productos || [],
      total: ordenData.total || 0
    };

    ordenes.push(nuevaOrden);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenes));
    
    return nuevaOrden;
  },

  // ✅ NUEVA FUNCIÓN: Obtener órdenes por RUN de usuario
  async getOrdenesByUsuario(run) {
    const ordenes = await this.getOrdenes();
    return ordenes.filter(orden => orden.run === run);
  },

  // ✅ NUEVA FUNCIÓN: Obtener estadísticas de órdenes
  async getEstadisticasOrdenes() {
    const ordenes = await this.getOrdenes();
    
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
  }
};

// ✅ Función para migrar datos explícitamente (opcional)
export const migrarOrdenesAAppOrdenes = async () => {
  try {
    const ordenesLegacy = localStorage.getItem(STORAGE_KEY_LEGACY);
    const ordenesActual = localStorage.getItem(STORAGE_KEY);
    
    if (ordenesLegacy && !ordenesActual) {
      // Migrar datos
      const ordenes = JSON.parse(ordenesLegacy);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ordenes));
      localStorage.removeItem(STORAGE_KEY_LEGACY);
      console.log('Órdenes migradas exitosamente a app_ordenes');
      return true;
    }
    
    if (ordenesLegacy && ordenesActual) {
      console.log('app_ordenes ya existe, manteniendo datos actuales');
      // Opcional: aquí podrías fusionar datos si es necesario
    }
    
    return false;
  } catch (error) {
    console.error('Error migrando órdenes:', error);
    return false;
  }
};

// Ejecutar migración al cargar (opcional)
migrarOrdenesAAppOrdenes().then(success => {
  if (success) {
    console.log('Migración automática de órdenes completada');
  }
});