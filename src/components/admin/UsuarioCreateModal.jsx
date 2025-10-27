// src/components/admin/UsuarioCreateModal.jsx
import { useState, useEffect } from 'react';

const UsuarioCreateModal = ({ show, usuario, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    fecha_nacimiento: '',
    tipo: 'Cliente',
    password: '',
    confirmarPassword: ''
  });

  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

  // Resetear el formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (show) {
      setFormData({
        run: '',
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: '',
        direccion: '',
        comuna: '',
        region: '',
        fecha_nacimiento: '',
        tipo: 'Cliente',
        password: '',
        confirmarPassword: ''
      });
      setErrores({});
      setMostrarPassword(false);
      setMostrarConfirmarPassword(false);
    }
  }, [show]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar RUN (7-8 caracteres numéricos SIN formato)
    const runLimpio = formData.run.replace(/\D/g, '');
    const runRegex = /^\d{7,8}$/;
    if (!formData.run.trim()) {
      nuevosErrores.run = 'El RUN es obligatorio';
    } else if (!runRegex.test(runLimpio)) {
      nuevosErrores.run = 'El RUN debe tener 7 u 8 dígitos numéricos (sin puntos ni guión)';
    }

    // Validar nombre (mínimo 3 caracteres)
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar apellidos (mínimo 3 caracteres)
    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios';
    } else if (formData.apellidos.trim().length < 3) {
      nuevosErrores.apellidos = 'Los apellidos deben tener al menos 3 caracteres';
    }

    // Validar email con dominios específicos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.correo)) {
      nuevosErrores.correo = 'Formato de correo electrónico inválido';
    } else if (!dominiosPermitidos.some(dominio => formData.correo.endsWith(dominio))) {
      nuevosErrores.correo = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com';
    }

    // Validar teléfono (debe empezar con 9 y tener 9 dígitos)
    const telefonoLimpio = formData.telefono.replace(/\s/g, '');
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (!/^9\d{8}$/.test(telefonoLimpio)) {
      nuevosErrores.telefono = 'El teléfono debe empezar con 9 y tener 9 dígitos';
    }

    // Validar dirección (mínimo 3 caracteres)
    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria';
    } else if (formData.direccion.trim().length < 3) {
      nuevosErrores.direccion = 'La dirección debe tener al menos 3 caracteres';
    }

    // Validar fecha de nacimiento (obligatoria y mayor a 10 años)
    if (!formData.fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
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
        nuevosErrores.fecha_nacimiento = 'El usuario debe ser mayor de 10 años';
      }
    }

    // Validar contraseña (4-10 caracteres)
    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 4 || formData.password.length > 10) {
      nuevosErrores.password = 'La contraseña debe tener entre 4 y 10 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Debe confirmar la contraseña';
    } else if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    try {
      // Preparar datos para enviar (sin confirmarPassword y limpiar RUN)
      const datosParaEnviar = {
        run: formData.run.replace(/\D/g, ''), // Enviar solo números
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        telefono: formData.telefono.replace(/\s/g, ''),
        direccion: formData.direccion,
        comuna: formData.comuna,
        region: formData.region,
        fecha_nacimiento: formData.fecha_nacimiento,
        tipo: formData.tipo,
        password: formData.password
      };

      await onSave(datosParaEnviar);
    } catch (error) {
      if (error.message.includes('RUN')) {
        setErrores(prev => ({ ...prev, run: error.message }));
      } else if (error.message.includes('correo') || error.message.includes('email')) {
        setErrores(prev => ({ ...prev, correo: error.message }));
      } else {
        setErrores(prev => ({ ...prev, general: error.message }));
      }
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para RUN: solo permitir números y limitar a 8 dígitos
    if (name === 'run') {
      const soloNumeros = value.replace(/\D/g, '').slice(0, 8);
      setFormData(prev => ({
        ...prev,
        [name]: soloNumeros
      }));
    } 
    // Para teléfono: formatear automáticamente
    else if (name === 'telefono') {
      let telefonoLimpio = value.replace(/\D/g, '');
      if (telefonoLimpio.length <= 9) {
        // Formatear como 9 1234 5678
        if (telefonoLimpio.length > 1) {
          telefonoLimpio = telefonoLimpio.slice(0, 1) + ' ' + telefonoLimpio.slice(1);
        }
        if (telefonoLimpio.length > 6) {
          telefonoLimpio = telefonoLimpio.slice(0, 6) + ' ' + telefonoLimpio.slice(6);
        }
      }
      setFormData(prev => ({
        ...prev,
        [name]: telefonoLimpio
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getInputClass = (campo) => {
    return errores[campo] ? 'form-control is-invalid' : 'form-control';
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-plus me-2"></i>
              Crear Nuevo Usuario
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={cargando}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Mensaje de error general */}
              {errores.general && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{errores.general}</div>
                </div>
              )}

              <div className="row">
                {/* Columna 1 - Información básica */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      RUN <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={getInputClass('run')}
                      name="run"
                      value={formData.run}
                      onChange={handleChange}
                      placeholder="12345678"
                      disabled={cargando}
                      maxLength="8"
                    />
                    {errores.run && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.run}
                      </div>
                    )}
                    <small className="text-muted">
                      7 u 8 dígitos numéricos (sin puntos ni guión)
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={getInputClass('nombre')}
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ingrese el nombre"
                      disabled={cargando}
                    />
                    {errores.nombre && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.nombre}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Apellidos <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={getInputClass('apellidos')}
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      placeholder="Ingrese los apellidos"
                      disabled={cargando}
                    />
                    {errores.apellidos && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.apellidos}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Correo Electrónico <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="email" 
                      className={getInputClass('correo')}
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="usuario@duoc.cl"
                      disabled={cargando}
                    />
                    {errores.correo && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.correo}
                      </div>
                    )}
                    <small className="text-muted">
                      Solo @duoc.cl, @profesor.duoc.cl o @gmail.com
                    </small>
                  </div>
                </div>

                {/* Columna 2 - Información de contacto y seguridad */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Teléfono <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={getInputClass('telefono')}
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="9 1234 5678"
                      disabled={cargando}
                      maxLength="11"
                    />
                    {errores.telefono && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.telefono}
                      </div>
                    )}
                    <small className="text-muted">
                      Debe empezar con 9 y tener 9 dígitos
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Fecha de Nacimiento <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="date" 
                      className={getInputClass('fecha_nacimiento')}
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleChange}
                      disabled={cargando}
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

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Dirección <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={getInputClass('direccion')}
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Calle Principal 123"
                      disabled={cargando}
                    />
                    {errores.direccion && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.direccion}
                      </div>
                    )}
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
                          placeholder="Ej: Providencia"
                          disabled={cargando}
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
                          placeholder="Ej: Metropolitana"
                          disabled={cargando}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Línea divisoria */}
              <hr className="my-4" />

              {/* Sección de seguridad - En una sola fila */}
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Tipo de Usuario</label>
                    <select 
                      className="form-select"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      disabled={cargando}
                    >
                      <option value="Cliente">Cliente</option>
                      <option value="Admin">Administrador</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Contraseña <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input 
                        type={mostrarPassword ? "text" : "password"}
                        className={getInputClass('password')}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Entre 4 y 10 caracteres"
                        disabled={cargando}
                        maxLength="10"
                      />
                      <button 
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        disabled={cargando}
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
                    <small className="text-muted">
                      4 a 10 caracteres
                    </small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Confirmar Contraseña <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input 
                        type={mostrarConfirmarPassword ? "text" : "password"}
                        className={getInputClass('confirmarPassword')}
                        name="confirmarPassword"
                        value={formData.confirmarPassword}
                        onChange={handleChange}
                        placeholder="Repita la contraseña"
                        disabled={cargando}
                        maxLength="10"
                      />
                      <button 
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                        disabled={cargando}
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
                </div>
              </div>

              {/* Información de campos obligatorios */}
              <div className="alert alert-info mt-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i>
                  <small>
                    Los campos marcados con <span className="text-danger">*</span> son obligatorios
                  </small>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={cargando}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Creando...</span>
                    </div>
                    Creando Usuario...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Crear Usuario
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

export default UsuarioCreateModal;