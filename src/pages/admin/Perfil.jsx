// src/pages/admin/Perfil.jsx
import { useEffect } from 'react';
import { usePerfil } from '../../utils/admin/usePerfil';
import PerfilForm from '../../components/admin/PerfilForm';
import PerfilModal from '../../components/admin/PerfilModal';
import { authService } from '../../utils/tienda/auth';
import { formatDate } from '../../utils/admin/dashboardUtils';

const Perfil = () => {
  const {
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
  } = usePerfil();

  // Aplicar el fondo al body
  useEffect(() => {
    document.body.style.backgroundImage = 'url("https://images3.alphacoders.com/126/1269904.png")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    
    // Limpiar cuando el componente se desmonte
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.minHeight = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-white" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
        <div className="alert alert-danger" style={{ opacity: 0.95 }}>
          No se pudo cargar la información del perfil
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-white fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Mi Perfil
        </h1>
        <div className="text-white fw-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
          <i className="bi bi-person-circle me-2"></i>
          Administrador
        </div>
      </div>

      {/* Mensajes */}
      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} style={{ opacity: 0.95 }}>
          {mensaje.texto}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMensaje({ tipo: '', texto: '' })}
          ></button>
        </div>
      )}

      <div className="row">
        {/* Información del perfil - Vista amigable */}
        <div className="col-xl-8 col-lg-7">
          <PerfilForm
            usuario={usuario}
            onEdit={() => setShowModal(true)}
          />
        </div>

        {/* Sidebar con información adicional */}
        <div className="col-xl-4 col-lg-5">
          {/* Tarjeta de resumen */}
          <div className="card shadow mb-4" style={{ opacity: 0.95 }}>
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Resumen</h6>
            </div>
            <div className="card-body">
              <div className="text-center">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-person-fill text-white" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="font-weight-bold">{usuario.nombre} {usuario.apellidos}</h5>
                <p className="text-muted mb-3">{usuario.correo}</p>
                
                <div className="d-flex justify-content-between border-top pt-3">
                  <div className="text-center">
                    <div className="text-primary fw-bold">{usuario.run}</div>
                    <small className="text-muted">RUN</small>
                  </div>
                  <div className="text-center">
                    <div className="text-success fw-bold">{usuario.tipo}</div>
                    <small className="text-muted">Rol</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de sistema */}
          <div className="card shadow" style={{ opacity: 0.95 }}>
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Información del Sistema</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Última actualización:</span>
                  <span className="fw-bold">{formatDate(new Date().toISOString())}</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Sesión activa desde:</span>
                  <span className="fw-bold">
                    {authService.getCurrentUser()?.loginTime 
                      ? formatDate(authService.getCurrentUser().loginTime)
                      : formatDate(new Date().toISOString())
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="card shadow mt-4" style={{ opacity: 0.95 }}>
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Acciones Rápidas</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary btn-sm shadow"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar Perfil
                </button>
                <button 
                  className="btn btn-outline-info btn-sm shadow"
                  onClick={cargarPerfil}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Actualizar Datos
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm shadow"
                  onClick={handleDelete}
                >
                  <i className="bi bi-trash me-2"></i>
                  Eliminar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <PerfilModal
        show={showModal}
        usuario={usuario}
        formData={formData}
        guardando={guardando}
        onClose={() => {
          setShowModal(false);
        }}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Perfil;