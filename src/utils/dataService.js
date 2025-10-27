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
  // ✅ INICIALIZAR DATOS
  initializeData: () => {
    if (!loadFromLocalstorage(PRODUCTOS_KEY)) {
      saveLocalstorage(PRODUCTOS_KEY, productosData);
    }
    if (!loadFromLocalstorage(USUARIOS_KEY)) {
      saveLocalstorage(USUARIOS_KEY, usuariosData);
    }
    if (!loadFromLocalstorage(ORDENES_KEY)) {
      saveLocalstorage(ORDENES_KEY, ordenesData);
    }
  },

  // ✅ PRODUCTOS - usando "codigo" como ID
  getProductos: () => {
    return loadFromLocalstorage(PRODUCTOS_KEY) || [];
  },

  addProducto: (producto) => {
    const productos = dataService.getProductos();
    
    // Validar que el código no exista
    const codigoExistente = productos.find(p => p.codigo === producto.codigo);
    if (codigoExistente) {
      throw new Error('Ya existe un producto con ese código');
    }

    const newProducto = {
      ...producto,
      // Mantener el código que viene del formulario
      stock: producto.stock || 0,
      stock_critico: producto.stock_critico || 0
    };
    
    productos.push(newProducto);
    saveLocalstorage(PRODUCTOS_KEY, productos);
    return newProducto;
  },

  updateProducto: (codigo, updatedProducto) => {
    const productos = dataService.getProductos();
    const index = productos.findIndex(p => p.codigo === codigo);
    if (index !== -1) {
      productos[index] = { 
        ...productos[index], 
        ...updatedProducto 
      };
      saveLocalstorage(PRODUCTOS_KEY, productos);
      return productos[index];
    }
    return null;
  },

  deleteProducto: (codigo) => {
    const productos = dataService.getProductos();
    const filteredProductos = productos.filter(p => p.codigo !== codigo);
    saveLocalstorage(PRODUCTOS_KEY, filteredProductos);
    return filteredProductos.length !== productos.length;
  },

  // ✅ USUARIOS - usando "run" como ID
  getUsuarios: () => {
    return loadFromLocalstorage(USUARIOS_KEY) || [];
  },

  addUsuario: (usuario) => {
    const usuarios = dataService.getUsuarios();
    
    // Validar que el RUN no exista
    const runExistente = usuarios.find(u => u.run === usuario.run);
    if (runExistente) {
      throw new Error('Ya existe un usuario con ese RUN');
    }

    const newUsuario = {
      ...usuario,
      tipo: usuario.tipo || 'Cliente' // Por defecto es Cliente
    };
    
    usuarios.push(newUsuario);
    saveLocalstorage(USUARIOS_KEY, usuarios);
    return newUsuario;
  },

  updateUsuario: (run, updatedUsuario) => {
    const usuarios = dataService.getUsuarios();
    const index = usuarios.findIndex(u => u.run === run);
    if (index !== -1) {
      usuarios[index] = { 
        ...usuarios[index], 
        ...updatedUsuario 
      };
      saveLocalstorage(USUARIOS_KEY, usuarios);
      return usuarios[index];
    }
    return null;
  },

  deleteUsuario: (run) => {
    const usuarios = dataService.getUsuarios();
    const filteredUsuarios = usuarios.filter(u => u.run !== run);
    saveLocalstorage(USUARIOS_KEY, filteredUsuarios);
    return filteredUsuarios.length !== usuarios.length;
  },

  // ✅ ÓRDENES - usando "numeroOrden" como ID
  getOrdenes: () => {
    return loadFromLocalstorage(ORDENES_KEY) || [];
  },

  addOrden: (orden) => {
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
    return newOrden;
  },

  updateOrden: (numeroOrden, updatedOrden) => {
    const ordenes = dataService.getOrdenes();
    const index = ordenes.findIndex(o => o.numeroOrden === numeroOrden);
    if (index !== -1) {
      ordenes[index] = { 
        ...ordenes[index], 
        ...updatedOrden 
      };
      saveLocalstorage(ORDENES_KEY, ordenes);
      return ordenes[index];
    }
    return null;
  },

  deleteOrden: (numeroOrden) => {
    const ordenes = dataService.getOrdenes();
    const filteredOrdenes = ordenes.filter(o => o.numeroOrden !== numeroOrden);
    saveLocalstorage(ORDENES_KEY, filteredOrdenes);
    return filteredOrdenes.length !== ordenes.length;
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

  // ✅ RESET DATOS
  resetData: () => {
    saveLocalstorage(PRODUCTOS_KEY, productosData);
    saveLocalstorage(USUARIOS_KEY, usuariosData);
    saveLocalstorage(ORDENES_KEY, ordenesData);
    console.log('Datos reseteados a valores iniciales');
  }
};