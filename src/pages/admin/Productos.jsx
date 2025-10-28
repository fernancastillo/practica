// src/pages/admin/Productos.jsx
import { useState, useEffect } from 'react';
import { useProductos } from '../../utils/admin/useProductos';
import ProductosTable from '../../components/admin/ProductosTable';
import ProductoModal from '../../components/admin/ProductoModal';
import ProductosFiltros from '../../components/admin/ProductosFiltros';
import ReporteModal from '../../components/admin/ReporteModal';
import {
  generarReporteCSV,
  generarReporteCSVExcel,
  generarReporteJSON,
  descargarArchivo,
  generarEstadisticas,
  formatearFecha
} from '../../utils/admin/reportUtils';

const Productos = () => {
  const {
    productos,
    productosFiltrados,
    categorias,
    loading,
    editingProducto,
    showModal,
    filtros,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handleCreateNew,
    handleCloseModal,
    getCodigoAutomatico,
    actualizarCategorias,
    handleFiltroChange,
    handleLimpiarFiltros
  } = useProductos();

  // Estado para controlar el modal de reportes
  const [showReporteModal, setShowReporteModal] = useState(false);

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

  const handleSave = (productoData) => {
    if (editingProducto) {
      const result = handleUpdate(editingProducto.codigo, productoData);
      if (!result.success) {
        alert(result.error);
      } else {
        setTimeout(() => {
          actualizarCategorias();
        }, 100);
      }
    } else {
      const result = handleCreate(productoData);
      if (!result.success) {
        alert(result.error);
      } else {
        setTimeout(() => {
          actualizarCategorias();
        }, 100);
      }
    }
  };

  // Función para generar reportes
  const handleGenerarReporte = (formato = 'csv') => {
    try {
      const fecha = formatearFecha();
      let contenido, nombreArchivo, tipoMIME;

      if (formato === 'csv') {
        contenido = generarReporteCSV(productosFiltrados);
        nombreArchivo = `reporte_productos_${fecha}.csv`;
        tipoMIME = 'text/csv;charset=utf-8;';
      } else if (formato === 'csv-excel') {
        contenido = generarReporteCSVExcel(productosFiltrados);
        nombreArchivo = `reporte_productos_${fecha}.csv`;
        tipoMIME = 'text/csv;charset=utf-8;';
      } else {
        contenido = generarReporteJSON(productosFiltrados);
        nombreArchivo = `reporte_productos_${fecha}.json`;
        tipoMIME = 'application/json;charset=utf-8;';
      }

      descargarArchivo(contenido, nombreArchivo, tipoMIME);

      const estadisticas = generarEstadisticas(productosFiltrados);
      console.log('Estadísticas del reporte:', estadisticas);

    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte. Por favor, intenta nuevamente.');
    }
  };

  // Función para manejar selección de formato CSV
  const handleSeleccionCSV = (formato) => {
    handleGenerarReporte(formato);
    setShowReporteModal(false);
  };

  // Función para abrir modal de selección CSV
  const handleAbrirModalCSV = () => {
    setShowReporteModal(true);
  };

  // Función para cerrar modal de reportes
  const handleCerrarModalReporte = () => {
    setShowReporteModal(false);
  };

  // Función para manejar reporte JSON
  const handleReporteJSON = () => {
    const estadisticas = generarEstadisticas(productosFiltrados);

    const confirmar = window.confirm(`
ESTADÍSTICAS DEL REPORTE:

• Total de productos: ${estadisticas.totalProductos}
• Sin stock: ${estadisticas.sinStock}
• Stock crítico: ${estadisticas.stockCritico}
• Stock normal: ${estadisticas.stockNormal}
• Categorías: ${estadisticas.categorias}

¿Deseas descargar el reporte en formato JSON?
    `.trim());

    if (confirmar) {
      handleGenerarReporte('json');
    }
  };

  // Función principal para manejar reportes
  const handleReporteSolicitado = (formato) => {
    if (formato === 'csv') {
      handleAbrirModalCSV();
    } else {
      handleReporteJSON();
    }
  };

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

  const estadisticas = generarEstadisticas(productosFiltrados);

  return (
    <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-white fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Gestión de Productos
        </h1>
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-success shadow"
            onClick={handleCreateNew}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Producto
          </button>
          <button
            className="btn btn-primary shadow"
            onClick={() => handleReporteSolicitado('csv')}
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Reporte CSV
          </button>
          <button
            className="btn btn-warning shadow"
            onClick={() => handleReporteSolicitado('json')}
          >
            <i className="bi bi-file-code me-2"></i>
            Reporte JSON
          </button>
        </div>
      </div>

      {/* ✅ ESTADÍSTICAS - AHORA PRIMERO */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2" style={{ opacity: 0.95 }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Productos Filtrados
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {productosFiltrados.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-box-seam fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2" style={{ opacity: 0.95 }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Stock Crítico
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {productosFiltrados.filter(p => p.stock > 0 && p.stock <= p.stock_critico).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-exclamation-triangle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2" style={{ opacity: 0.95 }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Sin Stock
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {productosFiltrados.filter(p => p.stock === 0).length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-x-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2" style={{ opacity: 0.95 }}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Categorías Filtradas
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {new Set(productosFiltrados.map(p => p.categoria)).size}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-tags fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FILTROS - AHORA DESPUÉS DE LAS ESTADÍSTICAS */}
      <ProductosFiltros
        filtros={filtros}
        categorias={categorias}
        onFiltroChange={handleFiltroChange}
        onLimpiarFiltros={handleLimpiarFiltros}
        resultados={{
          filtrados: productosFiltrados.length,
          totales: productos.length
        }}
      />

      {/* Tabla de productos - usar productosFiltrados */}
      <ProductosTable
        productos={productosFiltrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGenerarReporte={handleReporteSolicitado}
      />

      {/* Modal para agregar/editar productos */}
      <ProductoModal
        show={showModal}
        producto={editingProducto}
        categorias={categorias}
        getCodigoAutomatico={getCodigoAutomatico}
        onSave={handleSave}
        onClose={handleCloseModal}
      />

      {/* Modal para reportes */}
      <ReporteModal
        show={showReporteModal}
        estadisticas={estadisticas}
        tipo="productos"
        onSeleccionarFormato={handleSeleccionCSV}
        onClose={handleCerrarModalReporte}
      />
    </div>
  );
};

export default Productos;