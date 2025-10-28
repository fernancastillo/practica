import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../../utils/admin/dashboardUtils';
import { dataService } from '../../utils/dataService';
import regionesComunasData from '../../data/regiones_comunas.json';

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

  const [errors, setErrors] = useState({});
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

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

      // Si hay región seleccionada, cargar sus comunas
      if (usuario.region) {
        const regionEncontrada = regionesComunasData.regiones.find(
          r => r.nombre === usuario.region
        );
        if (regionEncontrada) {
          setComunasFiltradas(regionEncontrada.comunas);
        }
      }

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

  // Función para validar email con dominios específicos
  const validarEmail = (email) => {
    if (!email.trim()) return 'El email es requerido';
    
    const dominiosPermitidos = ['gmail.com', 'duoc.cl', 'profesor.duoc.cl'];
    const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${dominiosPermitidos.join('|')})$`);
    
    if (!regex.test(email)) {
      return `El email debe ser de uno de estos dominios: ${dominiosPermitidos.join(', ')}`;
    }
    
    return '';
  };

  // Función para validar teléfono (opcional)
  const validarTelefono = (telefono) => {
    if (!telefono || telefono.trim() === '') return ''; // Teléfono es opcional
    
    // Remover todos los caracteres que no sean números
    const soloNumeros = telefono.replace(/\D/g, '');
    
    // Validar que tenga exactamente 9 dígitos y empiece con 9
    if (soloNumeros.length !== 9) {
      return 'El teléfono debe tener 9 dígitos';
    }
    
    if (!soloNumeros.startsWith('9')) {
      return 'El teléfono debe empezar con 9';
    }
    
    return '';
  };

  // Función para validar nombre y apellidos
  const validarNombre = (nombre) => {
    if (!nombre.trim()) return 'El nombre es requerido';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  };

  const validarApellidos = (apellidos) => {
    if (!apellidos.trim()) return 'Los apellidos son requeridos';
    if (apellidos.trim().length < 3) return 'Los apellidos deben tener al menos 3 caracteres';
    return '';
  };

  // Función para validar dirección (OBLIGATORIA)
  const validarDireccion = (direccion) => {
    if (!direccion.trim()) return 'La dirección es obligatoria';
    
    if (direccion.trim().length < 5) {
      return 'La dirección debe tener al menos 5 caracteres';
    }
    
    if (direccion.trim().length > 100) {
      return 'La dirección no puede tener más de 100 caracteres';
    }
    
    return '';
  };

  // Función para manejar cambio de región
  const handleRegionChange = (e) => {
    const regionSeleccionada = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      region: regionSeleccionada,
      comuna: '' // Resetear comuna cuando cambia la región
    }));

    // Filtrar comunas según la región seleccionada
    if (regionSeleccionada) {
      const regionEncontrada = regionesComunasData.regiones.find(
        r => r.nombre === regionSeleccionada
      );
      if (regionEncontrada) {
        setComunasFiltradas(regionEncontrada.comunas);
      } else {
        setComunasFiltradas([]);
      }
    } else {
      setComunasFiltradas([]);
    }

    // Limpiar errores
    if (errors.region) {
      setErrors(prev => ({
        ...prev,
        region: ''
      }));
    }
  };

  // Función para manejar cambio de comuna
  const handleComunaChange = (e) => {
    const comunaSeleccionada = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      comuna: comunaSeleccionada
    }));

    // Limpiar errores
    if (errors.comuna) {
      setErrors(prev => ({
        ...prev,
        comuna: ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    const errorNombre = validarNombre(formData.nombre);
    if (errorNombre) newErrors.nombre = errorNombre;

    // Validar apellidos
    const errorApellidos = validarApellidos(formData.apellidos);
    if (errorApellidos) newErrors.apellidos = errorApellidos;

    // Validar email
    const errorEmail = validarEmail(formData.correo);
    if (errorEmail) newErrors.correo = errorEmail;

    // Validar teléfono (solo si se ingresó)
    if (formData.telefono && formData.telefono.trim() !== '') {
      const errorTelefono = validarTelefono(formData.telefono);
      if (errorTelefono) newErrors.telefono = errorTelefono;
    }

    // Validar dirección (OBLIGATORIA)
    const errorDireccion = validarDireccion(formData.direccion);
    if (errorDireccion) newErrors.direccion = errorDireccion;

    // Validar región y comuna (si se selecciona una, debe seleccionar la otra)
    if (formData.region && !formData.comuna) {
      newErrors.comuna = 'Debe seleccionar una comuna para la región elegida';
    }
    if (formData.comuna && !formData.region) {
      newErrors.region = 'Debe seleccionar una región para la comuna elegida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onUpdate(usuario.run, formData);
    onClose();
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
                              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleChange}
                              placeholder="Ej: Ana María"
                              minLength="3"
                              required
                            />
                            {errors.nombre && (
                              <div className="invalid-feedback">{errors.nombre}</div>
                            )}
                            <div className="form-text">
                              Mínimo 3 caracteres
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Apellidos *</label>
                            <input 
                              type="text" 
                              className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
                              name="apellidos"
                              value={formData.apellidos}
                              onChange={handleChange}
                              placeholder="Ej: González Pérez"
                              minLength="3"
                              required
                            />
                            {errors.apellidos && (
                              <div className="invalid-feedback">{errors.apellidos}</div>
                            )}
                            <div className="form-text">
                              Mínimo 3 caracteres
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Email *</label>
                        <input 
                          type="email" 
                          className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          placeholder="Ej: usuario@duoc.cl"
                          required
                        />
                        {errors.correo && (
                          <div className="invalid-feedback">{errors.correo}</div>
                        )}
                        <div className="form-text">
                          Dominios permitidos: gmail.com, duoc.cl, profesor.duoc.cl
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Teléfono</label>
                        <input 
                          type="text" 
                          className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="Ej: 912345678"
                        />
                        {errors.telefono && (
                          <div className="invalid-feedback">{errors.telefono}</div>
                        )}
                        <div className="form-text">
                          Opcional. Si se ingresa, debe empezar con 9 y tener 9 dígitos
                        </div>
                      </div>
                      
                      {/* ✅ DIRECCIÓN OBLIGATORIA */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">Dirección *</label>
                        <input 
                          type="text" 
                          className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          placeholder="Ej: Av. Principal 123"
                          minLength="5"
                          maxLength="100"
                          required
                        />
                        {errors.direccion && (
                          <div className="invalid-feedback">{errors.direccion}</div>
                        )}
                        <div className="form-text">
                          Entre 5 y 100 caracteres
                        </div>
                      </div>
                      
                      {/* ✅ REGIÓN Y COMUNA COMO COMBOBOX */}
                      <div className="row">
                        {/* ✅ REGIÓN PRIMERO (IZQUIERDA) */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Región</label>
                            <select
                              className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                              name="region"
                              value={formData.region}
                              onChange={handleRegionChange}
                            >
                              <option value="">Seleccionar región...</option>
                              {regionesComunasData.regiones.map(region => (
                                <option key={region.id} value={region.nombre}>
                                  {region.nombre}
                                </option>
                              ))}
                            </select>
                            {errors.region && (
                              <div className="invalid-feedback">{errors.region}</div>
                            )}
                          </div>
                        </div>

                        {/* ✅ COMUNA DESPUÉS (DERECHA) */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">Comuna</label>
                            <select
                              className={`form-select ${errors.comuna ? 'is-invalid' : ''}`}
                              name="comuna"
                              value={formData.comuna}
                              onChange={handleComunaChange}
                              disabled={!formData.region}
                            >
                              <option value="">Seleccionar comuna...</option>
                              {comunasFiltradas.map(comuna => (
                                <option key={comuna} value={comuna}>
                                  {comuna}
                                </option>
                              ))}
                            </select>
                            {errors.comuna && (
                              <div className="invalid-feedback">{errors.comuna}</div>
                            )}
                            <div className="form-text">
                              {!formData.region ? 'Primero selecciona una región' : `${comunasFiltradas.length} comunas disponibles`}
                            </div>
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