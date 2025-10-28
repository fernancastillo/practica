import { formatCurrency } from '../../utils/admin/dashboardUtils';

const ReporteModal = ({
  show,
  estadisticas,
  tipo = 'ordenes', // 'ordenes', 'usuarios', 'productos'
  onSeleccionarFormato,
  onClose
}) => {
  if (!show) return null;

  // Títulos según el tipo
  const titulos = {
    ordenes: 'Órdenes',
    usuarios: 'Usuarios',
    productos: 'Productos'
  };

  // Renderizar contenido según el tipo
  const renderContenido = () => {
    switch (tipo) {
      case 'usuarios':
        return renderEstadisticasUsuarios();
      case 'productos':
        return renderEstadisticasProductos();
      case 'ordenes':
      default:
        return renderEstadisticasOrdenes();
    }
  };

  const renderEstadisticasOrdenes = () => {
    const stats = estadisticas || {
      totalOrdenes: 0,
      pendientes: 0,
      enviadas: 0,
      entregadas: 0,
      canceladas: 0,
      ingresosTotales: formatCurrency(0)
    };

    const total = stats.totalOrdenes || 1;
    const porcentajes = {
      pendientes: Math.round((stats.pendientes / total) * 100),
      enviadas: Math.round((stats.enviadas / total) * 100),
      entregadas: Math.round((stats.entregadas / total) * 100),
      canceladas: Math.round((stats.canceladas / total) * 100)
    };

    return (
      <>
        {/* Resumen General */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h3 className="text-primary mb-1">{stats.totalOrdenes}</h3>
                <small className="text-muted">TOTAL ÓRDENES</small>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h3 className="text-success mb-1">{formatCurrency(Number(stats.ingresosTotales) || 0)}</h3>
                <small className="text-muted">INGRESOS TOTALES</small>
              </div>
            </div>
          </div>
        </div>

        {/* Distribución por Estado */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <i className="bi bi-pie-chart me-2"></i>
            Distribución por Estado
          </h6>

          <div className="row g-3">
            {/* Pendientes */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded bg-warning bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-clock-fill text-warning fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Pendientes</span>
                    <span className="badge bg-warning text-dark">{stats.pendientes}</span>
                  </div>
                  <small className="text-muted">{porcentajes.pendientes}% del total</small>
                </div>
              </div>
            </div>

            {/* Enviadas */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded bg-info bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-truck text-info fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Enviadas</span>
                    <span className="badge bg-info text-dark">{stats.enviadas}</span>
                  </div>
                  <small className="text-muted">{porcentajes.enviadas}% del total</small>
                </div>
              </div>
            </div>

            {/* Entregadas */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded bg-success bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Entregadas</span>
                    <span className="badge bg-success">{stats.entregadas}</span>
                  </div>
                  <small className="text-muted">{porcentajes.entregadas}% del total</small>
                </div>
              </div>
            </div>

            {/* Canceladas */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded bg-danger bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-x-circle-fill text-danger fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Canceladas</span>
                    <span className="badge bg-danger">{stats.canceladas}</span>
                  </div>
                  <small className="text-muted">{porcentajes.canceladas}% del total</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderEstadisticasUsuarios = () => {
    const stats = estadisticas || {
      totalUsuarios: 0,
      totalClientes: 0,
      totalAdmins: 0,
      usuariosConCompras: 0
    };

    const total = stats.totalUsuarios || 1;
    const porcentajes = {
      clientes: Math.round((stats.totalClientes / total) * 100),
      admins: Math.round((stats.totalAdmins / total) * 100),
      conCompras: Math.round((stats.usuariosConCompras / total) * 100),
      sinCompras: Math.round(((total - stats.usuariosConCompras) / total) * 100)
    };

    return (
      <>
        {/* Resumen General */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h3 className="text-primary mb-1">{stats.totalUsuarios}</h3>
                <small className="text-muted">TOTAL USUARIOS</small>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h3 className="text-success mb-1">{stats.usuariosConCompras}</h3>
                <small className="text-muted">USUARIOS CON COMPRAS</small>
              </div>
            </div>
          </div>
        </div>

        {/* Distribución por Tipo */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <i className="bi bi-people-fill me-2"></i>
            Distribución por Tipo de Usuario
          </h6>

          <div className="row g-3">
            {/* Clientes */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded bg-info bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-person text-info fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Clientes</span>
                    <span className="badge bg-info text-dark">{stats.totalClientes}</span>
                  </div>
                  <small className="text-muted">{porcentajes.clientes}% del total</small>
                </div>
              </div>
            </div>

            {/* Administradores */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded bg-warning bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-shield-check text-warning fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Administradores</span>
                    <span className="badge bg-warning text-dark">{stats.totalAdmins}</span>
                  </div>
                  <small className="text-muted">{porcentajes.admins}% del total</small>
                </div>
              </div>
            </div>

            {/* Con Compras */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded bg-success bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-cart-check text-success fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Con Compras</span>
                    <span className="badge bg-success">{stats.usuariosConCompras}</span>
                  </div>
                  <small className="text-muted">{porcentajes.conCompras}% del total</small>
                </div>
              </div>
            </div>

            {/* Sin Compras */}
            <div className="col-md-6">
              <div className="d-flex align-items-center p-3 border rounded bg-secondary bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-cart-x text-secondary fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Sin Compras</span>
                    <span className="badge bg-secondary">{total - stats.usuariosConCompras}</span>
                  </div>
                  <small className="text-muted">{porcentajes.sinCompras}% del total</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usuario Top */}
        {stats.usuarioTop && stats.usuarioTop.nombre && (
          <div className="alert alert-warning mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-trophy-fill me-3 fs-4"></i>
              <div>
                <strong>Cliente Top:</strong> {stats.usuarioTop.nombre}
                <br />
                <small>Total gastado: {formatCurrency(stats.usuarioTop.totalGastado || 0)}</small>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderEstadisticasProductos = () => {
    const stats = estadisticas || {
      totalProductos: 0,
      sinStock: 0,
      stockCritico: 0,
      stockNormal: 0,
      categorias: 0 // Asegurar que categorías tenga valor por defecto
    };

    const total = stats.totalProductos || 1;
    const porcentajes = {
      sinStock: Math.round((stats.sinStock / total) * 100),
      stockCritico: Math.round((stats.stockCritico / total) * 100),
      stockNormal: Math.round((stats.stockNormal / total) * 100)
    };

    return (
      <>
        {/* Resumen General - MODIFICADO: Sin valor de inventario */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h3 className="text-primary mb-1">{stats.totalProductos}</h3>
                <small className="text-muted">TOTAL PRODUCTOS</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h3 className="text-warning mb-1">{stats.stockCritico}</h3>
                <small className="text-muted">STOCK CRÍTICO</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h3 className="text-info mb-1">{stats.categorias || 0}</h3>
                <small className="text-muted">CATEGORÍAS</small>
              </div>
            </div>
          </div>
        </div>

        {/* Distribución por Stock */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <i className="bi bi-box-seam me-2"></i>
            Estado del Inventario
          </h6>

          <div className="row g-3">
            {/* Sin Stock */}
            <div className="col-md-4">
              <div className="d-flex align-items-center p-3 border rounded bg-danger bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-x-circle text-danger fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Sin Stock</span>
                    <span className="badge bg-danger">{stats.sinStock}</span>
                  </div>
                  <small className="text-muted">{porcentajes.sinStock}% del total</small>
                </div>
              </div>
            </div>

            {/* Stock Crítico */}
            <div className="col-md-4">
              <div className="d-flex align-items-center p-3 border rounded bg-warning bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-exclamation-triangle text-warning fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Stock Crítico</span>
                    <span className="badge bg-warning text-dark">{stats.stockCritico}</span>
                  </div>
                  <small className="text-muted">{porcentajes.stockCritico}% del total</small>
                </div>
              </div>
            </div>

            {/* Stock Normal */}
            <div className="col-md-4">
              <div className="d-flex align-items-center p-3 border rounded bg-success bg-opacity-10">
                <div className="flex-shrink-0">
                  <i className="bi bi-check-circle text-success fs-4 me-3"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Stock Normal</span>
                    <span className="badge bg-success">{stats.stockNormal}</span>
                  </div>
                  <small className="text-muted">{porcentajes.stockNormal}% del total</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-graph-up me-2"></i>
              Estadísticas del Reporte - {titulos[tipo]}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {renderContenido()}

            {/* Selector de Formato CSV (común para todos) */}
            <div className="border-top pt-3">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-download me-2"></i>
                Seleccionar Formato de Descarga
              </h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className="card h-100 border-primary cursor-pointer hover-shadow"
                    onClick={() => onSeleccionarFormato('csv')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.classList.add('shadow-sm')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('shadow-sm')}
                  >
                    <div className="card-body text-center">
                      <i className="bi bi-file-earmark-spreadsheet text-primary fs-1 mb-2"></i>
                      <h6 className="fw-bold text-primary">CSV Estándar</h6>
                      <small className="text-muted">
                        Formato universal compatible con cualquier software
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="card h-100 border-success cursor-pointer hover-shadow"
                    onClick={() => onSeleccionarFormato('csv-excel')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.classList.add('shadow-sm')}
                    onMouseLeave={(e) => e.currentTarget.classList.remove('shadow-sm')}
                  >
                    <div className="card-body text-center">
                      <i className="bi bi-file-earmark-excel text-success fs-1 mb-2"></i>
                      <h6 className="fw-bold text-success">CSV para Excel</h6>
                      <small className="text-muted">
                        Optimizado específicamente para Microsoft Excel
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-info mt-3 mb-0">
                <div className="d-flex">
                  <i className="bi bi-info-circle me-2 mt-1"></i>
                  <div>
                    <small className="fw-bold">Recomendación:</small>
                    <br />
                    <small>
                      Usa <strong>CSV Estándar</strong> para compatibilidad universal o
                      <strong> CSV para Excel</strong> si trabajas principalmente con Microsoft Excel.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
            <small className="text-muted me-auto">
              {new Date().toLocaleDateString('es-CL')}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteModal;