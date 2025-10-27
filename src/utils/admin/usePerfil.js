// src/utils/admin/usePerfil.js
import { useState, useEffect } from 'react';
import { authService } from '../tienda/auth';
import { dataService } from '../dataService';

export const usePerfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = () => {
    try {
      setLoading(true);
      const usuarioActual = authService.getCurrentUser();
      
      if (usuarioActual) {
        const usuarios = dataService.getUsuarios();
        const usuarioCompleto = usuarios.find(u => u.run === usuarioActual.id);
        
        if (usuarioCompleto) {
          setUsuario(usuarioCompleto);
          setFormData({
            nombre: usuarioCompleto.nombre || '',
            apellidos: usuarioCompleto.apellidos || '',
            correo: usuarioCompleto.correo || '',
            telefono: usuarioCompleto.telefono || '',
            direccion: usuarioCompleto.direccion || '',
            comuna: usuarioCompleto.comuna || '',
            region: usuarioCompleto.region || '',
            fecha_nacimiento: usuarioCompleto.fecha_nacimiento || '',
            password: '',
            confirmarPassword: ''
          });
        }
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      setMensaje({ tipo: 'error', texto: 'Error al cargar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setGuardando(true);
    try {
      const usuarios = dataService.getUsuarios();
      const usuarioIndex = usuarios.findIndex(u => u.run === usuario.run);
      
      if (usuarioIndex !== -1) {
        // Validar email único (si se está modificando)
        if (formData.correo && formData.correo !== usuarios[usuarioIndex].correo) {
          const emailExistente = usuarios.find(u => u.correo === formData.correo && u.run !== usuario.run);
          if (emailExistente) {
            throw new Error('Ya existe un usuario con este email');
          }
        }

        const datosActualizados = {
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          correo: formData.correo.trim(),
          telefono: formData.telefono ? formData.telefono.replace(/\s/g, '') : '',
          direccion: formData.direccion || '',
          comuna: formData.comuna || '',
          region: formData.region || '',
          fecha_nacimiento: formData.fecha_nacimiento || ''
        };

        // Solo actualizar contraseña si se proporcionó una nueva
        if (formData.password && formData.password.trim()) {
          datosActualizados.contrasenha = formData.password;
        }

        usuarios[usuarioIndex] = {
          ...usuarios[usuarioIndex],
          ...datosActualizados
        };
        
        localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
        
        const usuarioActualizado = usuarios[usuarioIndex];
        setUsuario(usuarioActualizado);
        
        const userData = {
          id: usuarioActualizado.run,
          nombre: usuarioActualizado.nombre,
          email: usuarioActualizado.correo,
          type: usuarioActualizado.tipo,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        setShowModal(false);
        setMensaje({ tipo: 'success', texto: 'Perfil actualizado correctamente' });
        
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setMensaje({ tipo: 'error', texto: error.message || 'Error al actualizar el perfil' });
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async () => {
    // Verificar si hay al menos otro administrador
    const usuarios = dataService.getUsuarios();
    const otrosAdmins = usuarios.filter(u => 
      u.tipo === 'Admin' && u.run !== usuario.run
    );

    if (otrosAdmins.length === 0) {
      setMensaje({ 
        tipo: 'error', 
        texto: 'No se puede eliminar el perfil. Debe haber al menos otro usuario administrador en el sistema.' 
      });
      return;
    }

    const confirmacion = window.confirm(
      `¿Estás seguro de que quieres eliminar tu perfil?\n\n` +
      `• Nombre: ${usuario.nombre} ${usuario.apellidos}\n` +
      `• RUN: ${usuario.run}\n` +
      `• Email: ${usuario.correo}\n\n` +
      `⚠️ Esta acción no se puede deshacer.`
    );

    if (!confirmacion) return;

    try {
      const success = dataService.deleteUsuario(usuario.run);
      
      if (success) {
        setMensaje({ 
          tipo: 'success', 
          texto: 'Perfil eliminado correctamente. Serás redirigido al login.' 
        });
        
        setTimeout(() => {
          authService.logout();
        }, 2000);
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al eliminar el perfil' });
      }
    } catch (error) {
      console.error('Error eliminando perfil:', error);
      setMensaje({ tipo: 'error', texto: error.message || 'Error al eliminar el perfil' });
    }
  };

  return {
    usuario,
    formData,
    loading,
    guardando,
    mensaje,
    showModal,
    handleChange,
    handleSubmit,
    handleDelete,
    setMensaje,
    cargarPerfil,
    setShowModal
  };
};