// utils/dataService.js
import { saveLocalstorage, loadFromLocalstorage } from './localstorageHelper';
import productosData from '../data/productos.json';
import usuariosData from '../data/usuarios.json';
import ordenesData from '../data/ordenes.json';

// Claves para localStorage
const PRODUCTOS_KEY = 'app_productos';
const USUARIOS_KEY = 'app_usuarios';
const ORDENES_KEY = 'app_ordenes';

export const dataService = {
  // ✅ INICIALIZAR DATOS MEJORADO
  initializeData: () => {
    try {
      console.log('🔄 Inicializando datos en localStorage...');
      
      // Verificar y cargar productos
      const productosStorage = loadFromLocalstorage(PRODUCTOS_KEY);
      if (!productosStorage || !Array.isArray(productosStorage) || productosStorage.length === 0) {
        console.log('📦 Cargando productos iniciales desde JSON...');
        const saved = saveLocalstorage(PRODUCTOS_KEY, productosData);
        if (!saved) {
          throw new Error('No se pudieron guardar los productos');
        }
        console.log('✅ Productos cargados:', productosData.length);
      } else {
        console.log('📦 Productos ya existen en localStorage:', productosStorage.length);
      }

      // Verificar y cargar usuarios
      const usuariosStorage = loadFromLocalstorage(USUARIOS_KEY);
      if (!usuariosStorage || !Array.isArray(usuariosStorage) || usuariosStorage.length === 0) {
        console.log('👤 Cargando usuarios iniciales desde JSON...');
        saveLocalstorage(USUARIOS_KEY, usuariosData);
        console.log('✅ Usuarios cargados:', usuariosData.length);
      } else {
        console.log('👤 Usuarios ya existen en localStorage:', usuariosStorage.length);
      }

      // Verificar y cargar órdenes
      const ordenesStorage = loadFromLocalstorage(ORDENES_KEY);
      if (!ordenesStorage || !Array.isArray(ordenesStorage)) {
        console.log('📋 Cargando órdenes iniciales desde JSON...');
        saveLocalstorage(ORDENES_KEY, ordenesData);
        console.log('✅ Órdenes cargadas:', ordenesData.length);
      } else {
        console.log('📋 Órdenes ya existen en localStorage:', ordenesStorage.length);
      }

      console.log('✅ Inicialización de datos completada exitosamente');
      return true;
    } catch (error) {
      console.error('💥 Error en initializeData:', error);
      return false;
    }
  },

  // ✅ PRODUCTOS - con mejor manejo de errores
  getProductos: () => {
    try {
      const productos = loadFromLocalstorage(PRODUCTOS_KEY);
      if (!productos || !Array.isArray(productos)) {
        console.warn('⚠️ No hay productos en localStorage o formato inválido');
        return [];
      }
      return productos;
    } catch (error) {
      console.error('💥 Error obteniendo productos:', error);
      return [];
    }
  },

  addProducto: (producto) => {
    try {
      const productos = dataService.getProductos();
      
      // Validar que el código no exista
      const codigoExistente = productos.find(p => p.codigo === producto.codigo);
      if (codigoExistente) {
        throw new Error('Ya existe un producto con ese código');
      }

      const newProducto = {
        ...producto,
        stock: producto.stock || 0,
        stock_critico: producto.stock_critico || 0
      };
      
      productos.push(newProducto);
      saveLocalstorage(PRODUCTOS_KEY, productos);
      console.log('✅ Producto agregado:', newProducto.codigo);
      return newProducto;
    } catch (error) {
      console.error('💥 Error agregando producto:', error);
      throw error;
    }
  },

  updateProducto: (codigo, updatedProducto) => {
    try {
      const productos = dataService.getProductos();
      const index = productos.findIndex(p => p.codigo === codigo);
      if (index !== -1) {
        productos[index] = { 
          ...productos[index], 
          ...updatedProducto 
        };
        saveLocalstorage(PRODUCTOS_KEY, productos);
        console.log('✅ Producto actualizado:', codigo);
        return productos[index];
      }
      console.warn('⚠️ Producto no encontrado para actualizar:', codigo);
      return null;
    } catch (error) {
      console.error('💥 Error actualizando producto:', error);
      throw error;
    }
  },

  deleteProducto: (codigo) => {
    try {
      const productos = dataService.getProductos();
      const filteredProductos = productos.filter(p => p.codigo !== codigo);
      const wasDeleted = filteredProductos.length !== productos.length;
      
      if (wasDeleted) {
        saveLocalstorage(PRODUCTOS_KEY, filteredProductos);
        console.log('✅ Producto eliminado:', codigo);
      } else {
        console.warn('⚠️ Producto no encontrado para eliminar:', codigo);
      }
      
      return wasDeleted;
    } catch (error) {
      console.error('💥 Error eliminando producto:', error);
      throw error;
    }
  },

  // ✅ USUARIOS - usando "run" como ID
  getUsuarios: () => {
    try {
      const usuarios = loadFromLocalstorage(USUARIOS_KEY);
      if (!usuarios || !Array.isArray(usuarios)) {
        console.warn('⚠️ No hay usuarios en localStorage o formato inválido');
        return [];
      }
      return usuarios;
    } catch (error) {
      console.error('💥 Error obteniendo usuarios:', error);
      return [];
    }
  },

  addUsuario: (usuario) => {
    try {
      const usuarios = dataService.getUsuarios();
      
      // Validar que el RUN no exista
      const runExistente = usuarios.find(u => u.run === usuario.run);
      if (runExistente) {
        throw new Error('Ya existe un usuario con ese RUN');
      }

      const newUsuario = {
        ...usuario,
        tipo: usuario.tipo || 'Cliente'
      };
      
      usuarios.push(newUsuario);
      saveLocalstorage(USUARIOS_KEY, usuarios);
      console.log('✅ Usuario agregado:', newUsuario.run);
      return newUsuario;
    } catch (error) {
      console.error('💥 Error agregando usuario:', error);
      throw error;
    }
  },

  updateUsuario: (run, updatedUsuario) => {
    try {
      const usuarios = dataService.getUsuarios();
      const index = usuarios.findIndex(u => u.run === run);
      if (index !== -1) {
        usuarios[index] = { 
          ...usuarios[index], 
          ...updatedUsuario 
        };
        saveLocalstorage(USUARIOS_KEY, usuarios);
        console.log('✅ Usuario actualizado:', run);
        return usuarios[index];
      }
      console.warn('⚠️ Usuario no encontrado para actualizar:', run);
      return null;
    } catch (error) {
      console.error('💥 Error actualizando usuario:', error);
      throw error;
    }
  },

  deleteUsuario: (run) => {
    try {
      const usuarios = dataService.getUsuarios();
      const filteredUsuarios = usuarios.filter(u => u.run !== run);
      const wasDeleted = filteredUsuarios.length !== usuarios.length;
      
      if (wasDeleted) {
        saveLocalstorage(USUARIOS_KEY, filteredUsuarios);
        console.log('✅ Usuario eliminado:', run);
      } else {
        console.warn('⚠️ Usuario no encontrado para eliminar:', run);
      }
      
      return wasDeleted;
    } catch (error) {
      console.error('💥 Error eliminando usuario:', error);
      throw error;
    }
  },

  // ✅ ÓRDENES - usando "numeroOrden" como ID
  getOrdenes: () => {
    try {
      const ordenes = loadFromLocalstorage(ORDENES_KEY);
      if (!ordenes || !Array.isArray(ordenes)) {
        console.warn('⚠️ No hay órdenes en localStorage o formato inválido');
        return [];
      }
      return ordenes;
    } catch (error) {
      console.error('💥 Error obteniendo órdenes:', error);
      return [];
    }
  },

  addOrden: (orden) => {
    try {
      const ordenes = dataService.getOrdenes();
      
      // Validar que el número de orden no exista
      const ordenExistente = ordenes.find(o => o.numeroOrden === orden.numeroOrden);
      if (ordenExistente) {
        throw new Error('Ya existe una orden con ese número');
      }

      const newOrden = {
        ...orden,
        fecha: orden.fecha || new Date().toLocaleDateString('es-CL'),
        estadoEnvio: orden.estadoEnvio || 'Pendiente',
        total: orden.total || 0
      };
      
      ordenes.push(newOrden);
      saveLocalstorage(ORDENES_KEY, ordenes);
      console.log('✅ Orden agregada:', newOrden.numeroOrden);
      return newOrden;
    } catch (error) {
      console.error('💥 Error agregando orden:', error);
      throw error;
    }
  },

  updateOrden: (numeroOrden, updatedOrden) => {
    try {
      const ordenes = dataService.getOrdenes();
      const index = ordenes.findIndex(o => o.numeroOrden === numeroOrden);
      if (index !== -1) {
        ordenes[index] = { 
          ...ordenes[index], 
          ...updatedOrden 
        };
        saveLocalstorage(ORDENES_KEY, ordenes);
        console.log('✅ Orden actualizada:', numeroOrden);
        return ordenes[index];
      }
      console.warn('⚠️ Orden no encontrada para actualizar:', numeroOrden);
      return null;
    } catch (error) {
      console.error('💥 Error actualizando orden:', error);
      throw error;
    }
  },

  deleteOrden: (numeroOrden) => {
    try {
      const ordenes = dataService.getOrdenes();
      const filteredOrdenes = ordenes.filter(o => o.numeroOrden !== numeroOrden);
      const wasDeleted = filteredOrdenes.length !== ordenes.length;
      
      if (wasDeleted) {
        saveLocalstorage(ORDENES_KEY, filteredOrdenes);
        console.log('✅ Orden eliminada:', numeroOrden);
      } else {
        console.warn('⚠️ Orden no encontrada para eliminar:', numeroOrden);
      }
      
      return wasDeleted;
    } catch (error) {
      console.error('💥 Error eliminando orden:', error);
      throw error;
    }
  },

  // ✅ MÉTODOS ESPECIALES PARA ÓRDENES
  getOrdenesPorUsuario: (run) => {
    const ordenes = dataService.getOrdenes();
    return ordenes.filter(orden => orden.run === run);
  },

  getOrdenesPorEstado: (estado) => {
    const ordenes = dataService.getOrdenes();
    return ordenes.filter(orden => orden.estadoEnvio === estado);
  },

  // ✅ MÉTODOS ESPECIALES PARA PRODUCTOS
  getProductosPorCategoria: (categoria) => {
    const productos = dataService.getProductos();
    return productos.filter(producto => producto.categoria === categoria);
  },

  getProductosStockCritico: () => {
    const productos = dataService.getProductos();
    return productos.filter(producto => producto.stock <= producto.stock_critico);
  },

  // ✅ MÉTODOS ESPECIALES PARA USUARIOS
  getUsuariosPorTipo: (tipo) => {
    const usuarios = dataService.getUsuarios();
    return usuarios.filter(usuario => usuario.tipo === tipo);
  },

  // ✅ RESET DATOS COMPLETO
  resetData: () => {
    try {
      console.log('🔄 Reseteando todos los datos a valores iniciales...');
      saveLocalstorage(PRODUCTOS_KEY, productosData);
      saveLocalstorage(USUARIOS_KEY, usuariosData);
      saveLocalstorage(ORDENES_KEY, ordenesData);
      
      console.log('✅ Datos reseteados exitosamente:');
      console.log('  📦 Productos:', productosData.length);
      console.log('  👤 Usuarios:', usuariosData.length);
      console.log('  📋 Órdenes:', ordenesData.length);
      
      return true;
    } catch (error) {
      console.error('💥 Error reseteando datos:', error);
      throw error;
    }
  },

  // ✅ VERIFICAR ESTADO DE DATOS
  checkDataStatus: () => {
    const productos = dataService.getProductos();
    const usuarios = dataService.getUsuarios();
    const ordenes = dataService.getOrdenes();
    
    return {
      productos: {
        count: productos.length,
        loaded: productos.length > 0
      },
      usuarios: {
        count: usuarios.length,
        loaded: usuarios.length > 0
      },
      ordenes: {
        count: ordenes.length,
        loaded: ordenes.length > 0
      }
    };
  }
};