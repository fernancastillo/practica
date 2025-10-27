// src/components/admin/UsuarioForm.jsx
import { useState, useEffect } from 'react';

const UsuarioForm = ({ usuario, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    tipo: 'Cliente',
    fecha_nacimiento: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (usuario) {
      // Modo edición
      setFormData({
        run: usuario.run || '',
        nombre: usuario.nombre || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        comuna: usuario.comuna || '',
        region: usuario.region || '',
        tipo: usuario.tipo || 'Cliente',
        fecha_nacimiento: usuario.fecha_nacimiento || ''
      });
    } else {
      // Modo creación - resetear formulario
      setFormData({
        run: '',
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: '',
        direccion: '',
        comuna: '',
        region: '',
        tipo: 'Cliente',
        fecha_nacimiento: ''
      });
    }
  }, [usuario]);

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

  // Función para validar RUN (solo números, sin dígito verificador)
  const validarRUN = (run) => {
    if (!run.trim()) return 'El RUN es requerido';
    
    // Solo números, sin puntos ni dígito verificador
    if (!/^\d+$/.test(run)) {
      return 'El RUN debe contener solo números (sin puntos ni guión)';
    }
    
    // Entre 7 y 8 caracteres
    if (run.length < 7 || run.length > 8) {
      return 'El RUN debe tener entre 7 y 8 dígitos';
    }
    
    return '';
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

  // Función para validar teléfono (simplificada)
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

  // Función para formatear RUN mientras se escribe (solo números)
  const handleRunChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    setFormData(prev => ({
      ...prev,
      run: value
    }));

    if (errors.run) {
      setErrors(prev => ({
        ...prev,
        run: ''
      }));
    }
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

  const validateForm = () => {
    const newErrors = {};

    // Validar RUN
    const errorRUN = validarRUN(formData.run);
    if (errorRUN) newErrors.run = errorRUN;

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    }

    // Validar email
    const errorEmail = validarEmail(formData.correo);
    if (errorEmail) newErrors.correo = errorEmail;

    // Validar teléfono (solo si se ingresó)
    if (formData.telefono && formData.telefono.trim() !== '') {
      const errorTelefono = validarTelefono(formData.telefono);
      if (errorTelefono) newErrors.telefono = errorTelefono;
    }

    // Validar fecha de nacimiento
    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const edad = calcularEdad(formData.fecha_nacimiento);
      
      if (edad < 10) {
        newErrors.fecha_nacimiento = 'El usuario debe ser mayor de 10 años';
      }
      
      // Validar que no sea una fecha futura
      const fechaNac = new Date(formData.fecha_nacimiento);
      const hoy = new Date();
      if (fechaNac > hoy) {
        newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Preparar datos para enviar
    const usuarioData = {
      run: formData.run, // RUN sin formato
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      correo: formData.correo,
      telefono: formData.telefono || '',
      direccion: formData.direccion || '',
      comuna: formData.comuna || '',
      region: formData.region || '',
      tipo: formData.tipo,
      fecha_nacimiento: formData.fecha_nacimiento,
      // Campos por defecto para nuevo usuario
      estado: 'Activo',
      totalCompras: 0,
      totalGastado: 0
    };

    onSubmit(usuarioData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="run" className="form-label fw-bold">
              RUN *
            </label>
            <input
              type="text"
              className={`form-control ${errors.run ? 'is-invalid' : ''}`}
              id="run"
              name="run"
              value={formData.run}
              onChange={handleRunChange} // Usar la función especial para RUN
              placeholder="Ej: 12345678"
              disabled={!!usuario} // No permitir modificar RUN en edición
              maxLength={8}
            />
            {errors.run && <div className="invalid-feedback">{errors.run}</div>}
            <div className="form-text">
              Solo números, sin puntos ni dígito verificador (7-8 dígitos)
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="tipo" className="form-label fw-bold">
              Tipo de Usuario *
            </label>
            <select
              className={`form-select ${errors.tipo ? 'is-invalid' : ''}`}
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="Cliente">Cliente</option>
              <option value="Admin">Administrador</option>
            </select>
            {errors.tipo && <div className="invalid-feedback">{errors.tipo}</div>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label fw-bold">
              Nombre *
            </label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Ana María"
              required
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label fw-bold">
              Apellidos *
            </label>
            <input
              type="text"
              className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`}
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Ej: González Pérez"
              required
            />
            {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="correo" className="form-label fw-bold">
          Email *
        </label>
        <input
          type="email"
          className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="Ej: usuario@gmail.com"
          required
        />
        {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
        <div className="form-text">
          Dominios permitidos: gmail.com, duoc.cl, profesor.duoc.cl
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="telefono" className="form-label fw-bold">
          Teléfono
        </label>
        <input
          type="text"
          className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej: 912345678"
        />
        {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
        <div className="form-text">
          Debe empezar con 9 y tener exactamente 9 dígitos
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="fecha_nacimiento" className="form-label fw-bold">
          Fecha de Nacimiento *
        </label>
        <input
          type="date"
          className={`form-control ${errors.fecha_nacimiento ? 'is-invalid' : ''}`}
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          required
        />
        {errors.fecha_nacimiento && <div className="invalid-feedback">{errors.fecha_nacimiento}</div>}
        <div className="form-text">
          El usuario debe ser mayor de 10 años
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="direccion" className="form-label fw-bold">
          Dirección
        </label>
        <input
          type="text"
          className="form-control"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Ej: Av. Principal 123"
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="comuna" className="form-label fw-bold">
              Comuna
            </label>
            <input
              type="text"
              className="form-control"
              id="comuna"
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
              placeholder="Ej: Providencia"
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="region" className="form-label fw-bold">
              Región
            </label>
            <input
              type="text"
              className="form-control"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Ej: Metropolitana"
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-check-circle me-2"></i>
          {usuario ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
};

export default UsuarioForm;