import { useState, useEffect } from 'react';

// Importar datos de regiones y comunas
import regionesComunasData from '../../data/regiones_comunas.json';

const PerfilModal = ({
  show,
  usuario,
  formData,
  guardando,
  onClose,
  onChange,
  onSubmit
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [errores, setErrores] = useState({});
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

  // Inicializar comunas filtradas cuando cambia la región
  useEffect(() => {
    if (formData.region) {
      const regionEncontrada = regionesComunasData.regiones.find(
        r => r.nombre === formData.region
      );
      if (regionEncontrada) {
        setComunasFiltradas(regionEncontrada.comunas);
      } else {
        setComunasFiltradas([]);
      }
    } else {
      setComunasFiltradas([]);
    }
  }, [formData.region]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onSubmit(e);
    }
  };

  // Función para manejar cambio de región
  const handleRegionChange = (e) => {
    const regionSeleccionada = e.target.value;
    
    // Actualizar región y resetear comuna
    onChange({ target: { name: 'region', value: regionSeleccionada } });
    onChange({ target: { name: 'comuna', value: '' } });

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
    if (errores.region) {
      setErrores(prev => ({
        ...prev,
        region: ''
      }));
    }
  };

  // Función para manejar cambio de comuna
  const handleComunaChange = (e) => {
    const comunaSeleccionada = e.target.value;
    onChange({ target: { name: 'comuna', value: comunaSeleccionada } });

    // Limpiar errores
    if (errores.comuna) {
      setErrores(prev => ({
        ...prev,
        comuna: ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Para teléfono: solo permitir números y limitar a 9 dígitos
    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '').slice(0, 9);
      onChange({ target: { name, value: soloNumeros } });
    } else {
      onChange(e);
    }
  };

  // Función para validar email con dominios específicos
  const validarEmail = (email) => {
    if (!email?.trim()) return 'El correo electrónico es obligatorio';
    
    const dominiosPermitidos = ['gmail.com', 'duoc.cl', 'profesor.duoc.cl'];
    const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${dominiosPermitidos.join('|')})$`);
    
    if (!regex.test(email)) {
      return `Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com`;
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

  // Función para validar dirección (OBLIGATORIA)
  const validarDireccion = (direccion) => {
    if (!direccion?.trim()) return 'La dirección es obligatoria';
    
    if (direccion.trim().length < 5) {
      return 'La dirección debe tener al menos 5 caracteres';
    }
    
    if (direccion.trim().length > 100) {
      return 'La dirección no puede tener más de 100 caracteres';
    }
    
    return '';
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre (mínimo 3 caracteres)
    if (!formData.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar apellidos (mínimo 3 caracteres)
    if (!formData.apellidos?.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios';
    } else if (formData.apellidos.trim().length < 3) {
      nuevosErrores.apellidos = 'Los apellidos deben tener al menos 3 caracteres';
    }

    // Validar email con dominios específicos
    const errorEmail = validarEmail(formData.correo);
    if (errorEmail) nuevosErrores.correo = errorEmail;

    // Validar teléfono (opcional)
    if (formData.telefono && formData.telefono.trim() !== '') {
      const errorTelefono = validarTelefono(formData.telefono);
      if (errorTelefono) nuevosErrores.telefono = errorTelefono;
    }

    // ✅ Validar dirección (OBLIGATORIA)
    const errorDireccion = validarDireccion(formData.direccion);
    if (errorDireccion) nuevosErrores.direccion = errorDireccion;

    // Validar región y comuna (si se selecciona una, debe seleccionar la otra)
    if (formData.region && !formData.comuna) {
      nuevosErrores.comuna = 'Debe seleccionar una comuna para la región elegida';
    }
    if (formData.comuna && !formData.region) {
      nuevosErrores.region = 'Debe seleccionar una región para la comuna elegida';
    }

    // Validar fecha de nacimiento (mayor a 10 años si se proporciona)
    if (formData.fecha_nacimiento) {
      const fechaNacimiento = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      
      let edadCalculada = edad;
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edadCalculada--;
      }
      
      if (fechaNacimiento > hoy) {
        nuevosErrores.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
      } else if (edadCalculada < 10) {
        nuevosErrores.fecha_nacimiento = 'Debe ser mayor de 10 años';
      }
    }

    // Validar contraseña (4-10 caracteres si se proporciona)
    if (formData.password && formData.password.trim()) {
      if (formData.password.length < 4 || formData.password.length > 10) {
        nuevosErrores.password = 'La contraseña debe tener entre 4 y 10 caracteres';
      }

      // Validar confirmación de contraseña
      if (!formData.confirmarPassword) {
        nuevosErrores.confirmarPassword = 'Debe confirmar la contraseña';
      } else if (formData.password !== formData.confirmarPassword) {
        nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const getInputClass = (campo) => {
    return errores[campo] ? 'form-control is-invalid' : 'form-control';
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-pencil-square me-2"></i>
              Editar Perfil
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={guardando}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={getInputClass('nombre')}
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleChange}
                      placeholder="Ej: Ana María"
                      minLength="3"
                      required
                    />
                    {errores.nombre && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.nombre}
                      </div>
                    )}
                    <div className="form-text">
                      Mínimo 3 caracteres
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Apellidos <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={getInputClass('apellidos')}
                      name="apellidos"
                      value={formData.apellidos || ''}
                      onChange={handleChange}
                      placeholder="Ej: González Pérez"
                      minLength="3"
                      required
                    />
                    {errores.apellidos && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.apellidos}
                      </div>
                    )}
                    <div className="form-text">
                      Mínimo 3 caracteres
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  Correo Electrónico <span className="text-danger">*</span>
                </label>
                <input 
                  type="email" 
                  className={getInputClass('correo')}
                  name="correo"
                  value={formData.correo || ''}
                  onChange={handleChange}
                  placeholder="Ej: usuario@duoc.cl"
                  required
                />
                {errores.correo && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-x-circle me-1"></i>
                    {errores.correo}
                  </div>
                )}
                <small className="text-muted">
                  Dominios permitidos: gmail.com, duoc.cl, profesor.duoc.cl
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Teléfono</label>
                <input 
                  type="text" 
                  className={getInputClass('telefono')}
                  name="telefono"
                  value={formData.telefono || ''}
                  onChange={handleChange}
                  placeholder="912345678"
                  maxLength="9"
                />
                {errores.telefono && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-x-circle me-1"></i>
                    {errores.telefono}
                  </div>
                )}
                <small className="text-muted">
                  Opcional. Si se ingresa, debe empezar con 9 y tener 9 dígitos
                </small>
              </div>

              {/* ✅ DIRECCIÓN OBLIGATORIA */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Dirección <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  className={getInputClass('direccion')}
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleChange}
                  placeholder="Ej: Av. Principal 123"
                  minLength="5"
                  maxLength="100"
                  required
                />
                {errores.direccion && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-x-circle me-1"></i>
                    {errores.direccion}
                  </div>
                )}
                <small className="text-muted">
                  Entre 5 y 100 caracteres
                </small>
              </div>

              {/* ✅ REGIÓN Y COMUNA COMO COMBOBOX */}
              <div className="row">
                {/* ✅ REGIÓN PRIMERO (IZQUIERDA) */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Región</label>
                    <select
                      className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                      name="region"
                      value={formData.region || ''}
                      onChange={handleRegionChange}
                    >
                      <option value="">Seleccionar región...</option>
                      {regionesComunasData.regiones.map(region => (
                        <option key={region.id} value={region.nombre}>
                          {region.nombre}
                        </option>
                      ))}
                    </select>
                    {errores.region && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.region}
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ COMUNA DESPUÉS (DERECHA) */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Comuna</label>
                    <select
                      className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                      name="comuna"
                      value={formData.comuna || ''}
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
                    {errores.comuna && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.comuna}
                      </div>
                    )}
                    <div className="form-text">
                      {!formData.region ? 'Primero selecciona una región' : `${comunasFiltradas.length} comunas disponibles`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Fecha de Nacimiento</label>
                <input 
                  type="date" 
                  className={getInputClass('fecha_nacimiento')}
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento || ''}
                  onChange={handleChange}
                />
                {errores.fecha_nacimiento && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-x-circle me-1"></i>
                    {errores.fecha_nacimiento}
                  </div>
                )}
                <small className="text-muted">
                  Mayor de 10 años
                </small>
              </div>

              <hr />

              <div className="mb-3">
                <label className="form-label fw-bold">Nueva Contraseña</label>
                <div className="input-group">
                  <input 
                    type={mostrarPassword ? "text" : "password"}
                    className={getInputClass('password')}
                    name="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    placeholder="Dejar vacío para mantener la actual"
                    maxLength="10"
                  />
                  <button 
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                  >
                    <i className={`bi ${mostrarPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {errores.password && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-x-circle me-1"></i>
                    {errores.password}
                  </div>
                )}
                <small className="text-muted">Entre 4 y 10 caracteres (opcional)</small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Confirmar Contraseña</label>
                <div className="input-group">
                  <input 
                    type={mostrarConfirmarPassword ? "text" : "password"}
                    className={getInputClass('confirmarPassword')}
                    name="confirmarPassword"
                    value={formData.confirmarPassword || ''}
                    onChange={handleChange}
                    placeholder="Repetir contraseña"
                    maxLength="10"
                  />
                  <button 
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                  >
                    <i className={`bi ${mostrarConfirmarPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {errores.confirmarPassword && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-x-circle me-1"></i>
                    {errores.confirmarPassword}
                  </div>
                )}
              </div>

              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Los campos marcados con <span className="text-danger">*</span> son obligatorios.
                La contraseña solo se actualizará si se completa el campo.
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={guardando}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={guardando}
              >
                {guardando ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Guardando...</span>
                    </div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilModal;