// src/pages/admin/Usuarios.jsx
import { useState } from 'react';
import UsuariosStats from '../../components/admin/UsuariosStats';
import UsuariosFiltros from '../../components/admin/UsuariosFiltros';
import UsuariosTable from '../../components/admin/UsuariosTable';
import UsuarioModal from '../../components/admin/UsuarioModal';
import UsuarioCreateModal from '../../components/admin/UsuarioCreateModal';
import ReporteModal from '../../components/admin/ReporteModal';
import { useUsuarios } from '../../utils/admin/useUsuarios';
import { generarReporteUsuarios } from '../../utils/admin/reportUtils';

const Usuarios = () => {
  const {
    usuarios,
    usuariosFiltrados,
    loading,
    editingUsuario,
    showModal,
    showCreateModal,
    filtros,
    estadisticas,
    handleEdit,
    handleUpdateUsuario,
    handleDelete,
    handleCreate,
    handleCreateUsuario,
    handleCloseModal,
    handleCloseCreateModal,
    handleFiltroChange,
    handleLimpiarFiltros
  } = useUsuarios();

  const [showReporteModal, setShowReporteModal] = useState(false);

 const handleGenerarReporte = (formato) => {
// Si el usuario elige CSV, abre el modal para escoger tipo (CSV o CSV Excel)
if (formato === 'csv') {
setShowReporteModal(true);
return;
}

// Si el usuario elige JSON, genera directamente el archivo
if (formato === 'json') {
generarReporteUsuarios('json', usuariosFiltrados, estadisticas);
return;
}

// Otros formatos adicionales (por compatibilidad futura)
generarReporteUsuarios(formato, usuariosFiltrados, estadisticas);
};

const handleSeleccionFormato = (formato) => {
  generarReporteUsuarios(formato, usuariosFiltrados, estadisticas);
  setShowReporteModal(false);
};

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gray-800">Gestión de Usuarios</h1>
        <div className="d-flex flex-wrap gap-2"> {/* CONTENEDOR CON SEPARACIÓN */}
          <button
            className="btn btn-success"
            onClick={handleCreate}
          >
            <i className="bi bi-person-plus me-2"></i>
            Crear Usuario
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleGenerarReporte('csv')}
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Reporte CSV
          </button>
          <button
            className="btn btn-warning"
            onClick={() => handleGenerarReporte('json')}
          >
            <i className="bi bi-file-code me-2"></i>
            Reporte JSON
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <UsuariosStats estadisticas={estadisticas} />

      {/* Filtros */}
      <UsuariosFiltros
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        onLimpiarFiltros={handleLimpiarFiltros}
        resultados={{
          filtrados: usuariosFiltrados.length,
          totales: usuarios.length
        }}
      />

      {/* Tabla de usuarios */}
      <UsuariosTable
        usuarios={usuariosFiltrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal para crear usuario */}
      <UsuarioCreateModal
        show={showCreateModal}
        usuario={null}
        onSave={handleCreateUsuario}
        onClose={handleCloseCreateModal}
      />

      {/* Modal para ver/editar usuario */}
      <UsuarioModal
        show={showModal}
        usuario={editingUsuario}
        onClose={handleCloseModal}
        onUpdate={handleUpdateUsuario}
      />

      {/* Modal de reportes */}
      <ReporteModal
        show={showReporteModal}
        estadisticas={estadisticas}
        tipo="usuarios"
        onSeleccionarFormato={handleSeleccionFormato}
        onClose={() => setShowReporteModal(false)}
      />
    </div>
  );
};

export default Usuarios;