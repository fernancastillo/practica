import { useState, useEffect } from 'react';
import regionesComunasData from '../../data/regiones_comunas.json';

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
  const [comunasFiltradas, setComunasFiltradas] = useState([]);

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
      setComunasFiltradas([]);
    }
  }, [show]);

  // Función para validar RUN con algoritmo módulo 11
  const validarRUN = (run) => {
    if (!run.trim()) return 'El RUN es obligatorio';
    
    // Solo números, sin puntos ni dígito verificador
    if (!/^\d+$/.test(run)) {
      return 'El RUN debe contener solo números (sin puntos ni guión)';
    }
    
    // ✅ Entre 8 y 9 caracteres (sin dígito verificador)
    if (run.length < 8 || run.length > 9) {
      return 'El RUN debe tener entre 8 y 9 dígitos';
    }
    
    // Validar con algoritmo módulo 11
    const runStr = run.padStart(9, '0'); // Asegurar 9 dígitos para cálculo
    const factores = [3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    
    for (let i = 0; i < 8; i++) {
      suma += parseInt(runStr[i]) * factores[i];
    }
    
    const resto = suma % 11;
    const digitoVerificador = 11 - resto;
    
    // Validar dígito verificador
    let digitoEsperado;
    if (digitoVerificador === 11) {
      digitoEsperado = 0;
    } else if (digitoVerificador === 10) {
      digitoEsperado = 'K';
    } else {
      digitoEsperado = digitoVerificador;
    }
    
    // El RUN sin dígito verificador debe ser válido
    if (digitoEsperado === 'K') {
      // RUN válido pero con K
      return '';
    } else if (typeof digitoEsperado === 'number' && digitoEsperado >= 0 && digitoEsperado <= 9) {
      return '';
    } else {
      return 'RUN no válido';
    }
  };

  // Función para validar email con dominios específicos
  const validarEmail = (email) => {
    if (!email.trim()) return 'El correo electrónico es obligatorio';
    
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

  // Función para validar nombre y apellidos
  const validarNombre = (nombre) => {
    if (!nombre.trim()) return 'El nombre es obligatorio';
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  };

  const validarApellidos = (apellidos) => {
    if (!apellidos.trim()) return 'Los apellidos son obligatorios';
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

  // Función para calcular edad exacta
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    // Ajustar si aún no ha pasado el mes de cumpleaños este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
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
    
    setFormData(prev => ({
      ...prev,
      comuna: comunaSeleccionada
    }));

    // Limpiar errores
    if (errores.comuna) {
      setErrores(prev => ({
        ...prev,
        comuna: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar RUN con módulo 11
    const errorRUN = validarRUN(formData.run);
    if (errorRUN) nuevosErrores.run = errorRUN;

    // Validar nombre (mínimo 3 caracteres)
    const errorNombre = validarNombre(formData.nombre);
    if (errorNombre) nuevosErrores.nombre = errorNombre;

    // Validar apellidos (mínimo 3 caracteres)
    const errorApellidos = validarApellidos(formData.apellidos);
    if (errorApellidos) nuevosErrores.apellidos = errorApellidos;

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

    // Validar fecha de nacimiento (obligatoria y mayor a 10 años)
    if (!formData.fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else {
      const edad = calcularEdad(formData.fecha_nacimiento);
      
      if (edad < 10) {
        nuevosErrores.fecha_nacimiento = 'El usuario debe ser mayor de 10 años';
      }
      
      // Validar que no sea una fecha futura
      const fechaNac = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      if (fechaNac > hoy) {
        nuevosErrores.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
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
      // Preparar datos para enviar (sin confirmarPassword)
      const datosParaEnviar = {
        run: formData.run, // Ya está limpio (solo números)
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        correo: formData.correo,
        telefono: formData.telefono.replace(/\D/g, '') || '', // Limpiar teléfono
        direccion: formData.direccion.trim(), // ✅ Dirección obligatoria
        comuna: formData.comuna || '',
        region: formData.region || '',
        fecha_nacimiento: formData.fecha_nacimiento,
        tipo: formData.tipo,
        password: formData.password,
        // Campos por defecto para nuevo usuario
        estado: 'Activo',
        totalCompras: 0,
        totalGastado: 0
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
    
    // Para RUN: solo permitir números y limitar a 9 dígitos
    if (name === 'run') {
      const soloNumeros = value.replace(/\D/g, '').slice(0, 9); // ✅ 9 dígitos máximo
      setFormData(prev => ({
        ...prev,
        [name]: soloNumeros
      }));
    } 
    // Para teléfono: solo permitir números y limitar a 9 dígitos
    else if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({
        ...prev,
        [name]: soloNumeros
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
                      placeholder="123456789"
                      disabled={cargando}
                      maxLength="9" // ✅ 9 dígitos máximo
                    />
                    {errores.run && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.run}
                      </div>
                    )}
                    <small className="text-muted">
                      {/* ✅ ELIMINADO: "Se valida con algoritmo módulo 11" */}
                      8 o 9 dígitos numéricos (sin puntos ni guión)
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
                      minLength="3"
                    />
                    {errores.nombre && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.nombre}
                      </div>
                    )}
                    <small className="text-muted">
                      Mínimo 3 caracteres
                    </small>
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
                      minLength="3"
                    />
                    {errores.apellidos && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-x-circle me-1"></i>
                        {errores.apellidos}
                      </div>
                    )}
                    <small className="text-muted">
                      Mínimo 3 caracteres
                    </small>
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
                      Teléfono
                    </label>
                    <input 
                      type="text" 
                      className={getInputClass('telefono')}
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="912345678"
                      disabled={cargando}
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

                  {/* ✅ DIRECCIÓN OBLIGATORIA */}
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
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Región</label>
                        <select
                          className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                          name="region"
                          value={formData.region}
                          onChange={handleRegionChange}
                          disabled={cargando}
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
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Comuna</label>
                        <select
                          className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                          name="comuna"
                          value={formData.comuna}
                          onChange={handleComunaChange}
                          disabled={cargando || !formData.region}
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
                        <small className="text-muted">
                          {!formData.region ? 'Primero selecciona una región' : `${comunasFiltradas.length} comunas disponibles`}
                        </small>
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