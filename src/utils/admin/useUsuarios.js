// src/utils/admin/useUsuarios.js
import { useState, useEffect, useCallback } from 'react';
import { usuarioService } from './usuarioService';
import { calcularEstadisticasUsuarios, aplicarFiltrosUsuarios } from './usuarioStats';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingUsuario, setCreatingUsuario] = useState(null);
  const [filtros, setFiltros] = useState({
    run: '',
    nombre: '',
    email: '',
    tipo: ''
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    const filtered = aplicarFiltrosUsuarios(usuarios, filtros);
    setUsuariosFiltrados(filtered);
  }, [usuarios, filtros]);

  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = (usuario) => {
    // Validar que no sea administrador
    if (usuario.tipo === 'Admin') {
      alert('No se pueden editar usuarios administradores');
      return;
    }
    setEditingUsuario(usuario);
    setShowModal(true);
  };

  const handleUpdateUsuario = async (run, datosActualizados) => {
    try {
      // Validar que no se esté intentando modificar un administrador
      const usuarioOriginal = usuarios.find(u => u.run === run);
      if (usuarioOriginal && usuarioOriginal.tipo === 'Admin') {
        throw new Error('No se pueden modificar usuarios administradores');
      }
      
      await usuarioService.updateUsuario(run, datosActualizados);
      await loadUsuarios();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  };

  const handleDelete = async (run) => {
    try {
      // Validar que no sea administrador
      const usuario = usuarios.find(u => u.run === run);
      if (usuario && usuario.tipo === 'Admin') {
        throw new Error('No se pueden eliminar usuarios administradores');
      }
      
      await usuarioService.deleteUsuario(run);
      await loadUsuarios();
      return { success: true };
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return { success: false, error: error.message };
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUsuario(null);
  };

  const handleCreate = () => {
    setCreatingUsuario(null);
    setShowCreateModal(true);
  };

  const handleCreateUsuario = async (usuarioData) => {
    try {
      // Verificar si el RUN ya existe
      const usuarioExistente = await usuarioService.getUsuarioByRun(usuarioData.run);
      if (usuarioExistente) {
        throw new Error('Ya existe un usuario con este RUN');
      }

      await usuarioService.createUsuario(usuarioData);
      await loadUsuarios();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreatingUsuario(null);
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
      run: '',
      nombre: '',
      email: '',
      tipo: ''
    });
  };

  const refreshData = () => {
    loadUsuarios();
  };

  const estadisticas = calcularEstadisticasUsuarios(usuarios);

  return {
    // Estados
    usuarios,
    usuariosFiltrados,
    loading,
    editingUsuario,
    showModal,
    showCreateModal,
    creatingUsuario,
    filtros,
    estadisticas,
    
    // Acciones
    handleEdit,
    handleUpdateUsuario,
    handleDelete,
    handleCloseModal,
    handleCreate,
    handleCreateUsuario,
    handleCloseCreateModal,
    handleFiltroChange,
    handleLimpiarFiltros,
    refreshData,
    
    // Aliases para consistencia
    onEdit: handleEdit,
    onUpdate: handleUpdateUsuario,
    onDelete: handleDelete,
    onCloseModal: handleCloseModal,
    onCreate: handleCreate,
    onSave: handleCreateUsuario,
    onCloseCreateModal: handleCloseCreateModal
  };
};