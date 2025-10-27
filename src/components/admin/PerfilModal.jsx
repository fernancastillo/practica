// src/components/admin/PerfilModal.jsx
import { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onSubmit(e);
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

    // Para teléfono: formatear automáticamente
    if (name === 'telefono') {
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
      onChange({ target: { name, value: telefonoLimpio } });
    } else {
      onChange(e);
    }
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    if (!formData.correo?.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.correo)) {
      nuevosErrores.correo = 'Formato de correo electrónico inválido';
    } else if (!dominiosPermitidos.some(dominio => formData.correo.endsWith(dominio))) {
      nuevosErrores.correo = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com';
    }

    // Validar teléfono (debe empezar con 9 y tener 9 dígitos)
    const telefonoLimpio = formData.telefono?.replace(/\s/g, '') || '';
    if (formData.telefono && !/^9\d{8}$/.test(telefonoLimpio)) {
      nuevosErrores.telefono = 'El teléfono debe empezar con 9 y tener 9 dígitos';
    }

    // Validar dirección (mínimo 3 caracteres si se proporciona)
    if (formData.direccion && formData.direccion.trim().length < 3) {
      nuevosErrores.direccion = 'La dirección debe tener al menos 3 caracteres';
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
                      required
                    />
                    {errores.nombre && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.nombre}
                      </div>
                    )}
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
                      required
                    />
                    {errores.apellidos && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.apellidos}
                      </div>
                    )}
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
                  required
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

              <div className="mb-3">
                <label className="form-label fw-bold">Teléfono</label>
                <input 
                  type="text" 
                  className={getInputClass('telefono')}
                  name="telefono"
                  value={formData.telefono || ''}
                  onChange={handleChange}
                  placeholder="9 1234 5678"
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
                <label className="form-label fw-bold">Dirección</label>
                <input 
                  type="text" 
                  className={getInputClass('direccion')}
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleChange}
                  placeholder="Calle Principal 123"
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
                      value={formData.comuna || ''}
                      onChange={handleChange}
                      placeholder="Ej: Providencia"
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
                      value={formData.region || ''}
                      onChange={handleChange}
                      placeholder="Ej: Metropolitana"
                    />
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