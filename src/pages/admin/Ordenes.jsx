// src/pages/admin/Ordenes.jsx
import { useState } from 'react';
import OrdenesStats from '../../components/admin/OrdenesStats';
import OrdenesFiltros from '../../components/admin/OrdenesFiltros';
import OrdenesTable from '../../components/admin/OrdenesTable';
import OrdenModal from '../../components/admin/OrdenModal';
import ReporteModal from '../../components/admin/ReporteModal';
import { useOrdenes } from '../../utils/admin/useOrdenes';
import { generarReporteOrdenes } from '../../utils/admin/reportUtils';

const Ordenes = () => {
  const {
    ordenes,
    ordenesFiltradas,
    loading,
    editingOrden,
    showModal,
    filtros,
    estadisticas,
    handleEdit,
    handleUpdateEstado,
    handleDelete,
    handleCloseModal,
    handleFiltroChange,
    handleLimpiarFiltros
  } = useOrdenes();

  const [showReporteModal, setShowReporteModal] = useState(false);

const handleGenerarReporte = (formato) => {
  if (formato === 'csv') {
    // Mostrar modal para que el usuario elija CSV o CSV Excel
    setShowReporteModal(true);
  } else if (formato === 'json') {
    // Generar directamente el JSON
    generarReporteOrdenes('json', ordenesFiltradas);
  } else {
    // Cualquier otro formato (por compatibilidad futura)
    generarReporteOrdenes(formato, ordenesFiltradas);
  }
};

  const handleSeleccionFormato = (formato) => {
    // CORREGIDO: Usar el nuevo orden de parámetros
    generarReporteOrdenes(formato, ordenesFiltradas);
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
        <h1 className="h3 mb-0 text-gray-800">Gestión de Órdenes</h1>
        <div className="d-flex flex-wrap gap-2">
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
      <OrdenesStats estadisticas={estadisticas} />

      {/* Filtros */}
      <OrdenesFiltros
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        onLimpiarFiltros={handleLimpiarFiltros}
        resultados={{
          filtradas: ordenesFiltradas.length,
          totales: ordenes.length
        }}
      />

      {/* Tabla de órdenes */}
      <OrdenesTable
        ordenes={ordenesFiltradas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateEstado={handleUpdateEstado}
      />

      {/* Modal para ver detalles de orden */}
      <OrdenModal
        show={showModal}
        orden={editingOrden}
        onClose={handleCloseModal}
        onUpdateEstado={handleUpdateEstado}
      />

      {/* Modal de reportes */}
      <ReporteModal
        show={showReporteModal}
        estadisticas={estadisticas}
        tipo="ordenes"
        onSeleccionarFormato={handleSeleccionFormato}
        onClose={() => setShowReporteModal(false)}
      />
    </div>
  );
};

export default Ordenes;