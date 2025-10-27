// src/components/admin/UsuarioModal.jsx
import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../../utils/admin/dashboardUtils';
import { dataService } from '../../utils/dataService'; // Importar el dataService

const UsuarioModal = ({ show, usuario, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: ''
  });

  // Estado para el historial de compras
  const [historialCompras, setHistorialCompras] = useState([]);
  const [cargandoCompras, setCargandoCompras] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        comuna: usuario.comuna || '',
        region: usuario.region || ''
      });

      // Cargar historial de compras si el usuario es cliente
      if (usuario.tipo === 'Cliente' && usuario.run) {
        cargarHistorialCompras(usuario.run);
      }
    }
  }, [usuario]);

  // Función para cargar el historial de compras usando dataService
  const cargarHistorialCompras = async (run) => {
    try {
      setCargandoCompras(true);
      
      // Usar dataService para obtener órdenes del usuario
      const ordenesUsuario = dataService.getOrdenesPorUsuario(run);

      // Formatear las órdenes para el historial
      const historialFormateado = ordenesUsuario.map(orden => ({
        id: orden.numeroOrden || `orden-${Date.now()}-${Math.random()}`,
        fecha: orden.fecha || new Date().toLocaleDateString('es-CL'),
        total: orden.total || 0,
        estado: orden.estadoEnvio || 'Pendiente',
        productos: orden.productos || orden.items || [],
        numeroOrden: orden.numeroOrden || 'N/A',
        direccionEnvio: orden.direccionEnvio || orden.direccion || ''
      }));

      setHistorialCompras(historialFormateado);
    } catch (error) {
      console.error('Error cargando historial de compras:', error);
      setHistorialCompras([]);
    } finally {
      setCargandoCompras(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(usuario.run, formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getEstadoBadgeClass = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    switch (estadoLower) {
      case 'completado':
      case 'completo':
      case 'entregado':
      case 'despachado':
        return 'bg-success text-white';
      case 'pendiente':
      case 'procesando':
        return 'bg-warning text-dark';
      case 'cancelado':
      case 'rechazado':
        return 'bg-danger text-white';
      case 'en camino':
      case 'enviado':
      case 'despachado':
        return 'bg-info text-white';
      case 'preparando':
        return 'bg-primary text-white';
      default: 
        return 'bg-secondary text-white';
    }
  };

  const getTipoBadgeClass = (tipo) => {
    return tipo === 'Admin' ? 'bg-danger text-white' : 'bg-info text-white';
  };

  // Función para formatear la lista de productos
  const formatearProductos = (productos) => {
    if (!productos || productos.length === 0) {
      return 'Sin productos';
    }
    
    const nombresProductos = productos.map(producto => 
      producto.nombre || producto.nombreProducto || 'Producto sin nombre'
    );
    
    return nombresProductos.slice(0, 2).join(', ') + 
           (nombresProductos.length > 2 ? ` y ${nombresProductos.length - 2} más` : '');
  };

  // Calcular estadísticas basadas en las órdenes reales
  const totalGastado = historialCompras.reduce((total, orden) => total + (orden.total || 0), 0);
  const promedioPorOrden = historialCompras.length > 0 ? totalGastado / historialCompras.length : 0;

  if (!show || !usuario) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person me-2"></i>
              Detalles de Usuario: <span className="text-primary">{usuario.nombre} {usuario.apellidos}</span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Columna izquierda - Información personal y edición */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-light">
                    <h6 className="mb-0 fw-bold">
                      <i className="bi bi-info-circle me-2"></i>
                      Información Personal
                    </h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-bold">RUN</label>
                        <input 
                          type="text" 
                          className="form-control bg-light" 
                          value={usuario.run} 
                          readOnly 
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Nombre *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Apellidos *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="apellidos"
                              value={formData.apellidos}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Email *</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Teléfono</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Dirección</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Comuna</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="comuna"
                              value={formData.comuna}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Región</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="region"
                              value={formData.region}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                          <i className="bi bi-check-circle me-2"></i>
                          Guardar Cambios
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              {/* Columna derecha - Información de cuenta e historial de compras */}
              <div className="col-md-6">
                {/* Información de cuenta */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h6 className="mb-0 fw-bold">
                      <i className="bi bi-graph-up me-2"></i>
                      Estadísticas de Compras
                    </h6>
                  </div>
                  <div className="card-body">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="fw-bold text-muted">Tipo de Usuario:</td>
                          <td>
                            <span className={`badge ${getTipoBadgeClass(usuario.tipo)}`}>
                              {usuario.tipo}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Total de Órdenes:</td>
                          <td>
                            <span className="badge bg-primary">
                              {historialCompras.length} orden(es)
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Total Gastado:</td>
                          <td className="fw-bold text-success">
                            {formatCurrency(totalGastado)}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Promedio por Orden:</td>
                          <td>
                            {formatCurrency(promedioPorOrden)}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold text-muted">Órdenes Activas:</td>
                          <td>
                            <span className="badge bg-info">
                              {historialCompras.filter(o => 
                                o.estado?.toLowerCase() !== 'cancelado' && 
                                o.estado?.toLowerCase() !== 'entregado'
                              ).length}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Historial de compras - Solo para clientes */}
                {usuario.tipo === 'Cliente' && (
                  <div className="card">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">
                        <i className="bi bi-receipt me-2"></i>
                        Historial de Órdenes
                        <span className="badge bg-primary ms-2">
                          {historialCompras.length}
                        </span>
                      </h6>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => cargarHistorialCompras(usuario.run)}
                        title="Actualizar historial"
                        disabled={cargandoCompras}
                      >
                        <i className={`bi ${cargandoCompras ? 'bi-arrow-repeat' : 'bi-arrow-clockwise'}`}></i>
                      </button>
                    </div>
                    <div className="card-body p-0">
                      {cargandoCompras ? (
                        <div className="text-center py-4">
                          <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                          Cargando historial de órdenes...
                        </div>
                      ) : historialCompras.length > 0 ? (
                        <div className="table-responsive" style={{ maxHeight: '300px' }}>
                          <table className="table table-sm table-hover mb-0">
                            <thead className="sticky-top bg-light">
                              <tr>
                                <th># Orden</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Productos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {historialCompras.map((compra) => (
                                <tr key={compra.id}>
                                  <td>
                                    <small className="text-muted fw-bold">#{compra.numeroOrden}</small>
                                  </td>
                                  <td>
                                    <small>{formatDate(compra.fecha)}</small>
                                  </td>
                                  <td className="fw-bold text-success">
                                    {formatCurrency(compra.total)}
                                  </td>
                                  <td>
                                    <span className={`badge ${getEstadoBadgeClass(compra.estado)}`}>
                                      {compra.estado}
                                    </span>
                                  </td>
                                  <td>
                                    <small title={compra.productos?.map(p => p.nombre).join(', ')}>
                                      {formatearProductos(compra.productos)}
                                      <br />
                                      <span className="text-muted">
                                        ({compra.productos?.length || 0} producto(s))
                                      </span>
                                    </small>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted">
                          <i className="bi bi-cart-x display-6 d-block mb-2"></i>
                          <p>No se encontraron órdenes registradas</p>
                          <small>RUN: {usuario.run}</small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <i className="bi bi-x-circle me-2"></i>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioModal;