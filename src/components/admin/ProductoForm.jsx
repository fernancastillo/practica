import { useState, useEffect } from 'react';

const ProductoForm = ({ producto, categorias, getCodigoAutomatico, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'Accesorios',
    esNuevaCategoria: false,
    nuevaCategoria: '',
    precio: '',
    stock: '',
    stock_critico: '',
    imagen: ''
  });

  const [errors, setErrors] = useState({});
  const [imagenPrevia, setImagenPrevia] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState(''); // Estado para mostrar el código generado

  // Imagen por defecto
  const imagenPorDefecto = '/src/assets/admin/producto-default.png';

  useEffect(() => {
    if (producto) {
      // Modo edición - mostrar código existente
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        esNuevaCategoria: false,
        nuevaCategoria: '',
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        stock_critico: producto.stock_critico.toString(),
        imagen: producto.imagen || ''
      });
      setCodigoGenerado(producto.codigo); // Mostrar código existente
      setImagenPrevia(producto.imagen || imagenPorDefecto);
    } else {
      // Modo creación - generar código automático inicial
      const codigoAuto = getCodigoAutomatico('Accesorios');
      setCodigoGenerado(codigoAuto); // Guardar código generado
      setImagenPrevia(imagenPorDefecto);
    }
  }, [producto, getCodigoAutomatico]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Si cambia la categoría y no estamos editando, generar nuevo código
    if (name === 'categoria' && !producto) {
      const nuevoCodigo = getCodigoAutomatico(value);
      setCodigoGenerado(nuevoCodigo); // Actualizar código generado
    }

    // Si cambia la imagen, actualizar previsualización
    if (name === 'imagen') {
      setImagenPrevia(value || imagenPorDefecto);
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategoriaChange = (e) => {
    const { value } = e.target;
    
    if (value === '_nueva') {
      // Seleccionó "Nueva categoría"
      setFormData(prev => ({
        ...prev,
        esNuevaCategoria: true,
        categoria: ''
      }));
      // No generar código hasta que se escriba la nueva categoría
      setCodigoGenerado('---');
    } else {
      // Seleccionó una categoría existente
      setFormData(prev => ({
        ...prev,
        esNuevaCategoria: false,
        categoria: value,
        nuevaCategoria: ''
      }));

      // Generar nuevo código si no estamos editando
      if (!producto) {
        const nuevoCodigo = getCodigoAutomatico(value);
        setCodigoGenerado(nuevoCodigo);
      }
    }
  };

  const handleNuevaCategoriaChange = (e) => {
    const { value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      nuevaCategoria: value
    }));

    // Generar código cuando se escribe la nueva categoría (mínimo 2 caracteres)
    if (value.length >= 2 && !producto) {
      const nuevoCodigo = getCodigoAutomatico(value);
      setCodigoGenerado(nuevoCodigo);
    }

    // Limpiar error
    if (errors.nuevaCategoria) {
      setErrors(prev => ({
        ...prev,
        nuevaCategoria: ''
      }));
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagenUrl = URL.createObjectURL(file);
      setImagenPrevia(imagenUrl);
      setFormData(prev => ({
        ...prev,
        imagen: imagenUrl
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    
    if (formData.esNuevaCategoria) {
      if (!formData.nuevaCategoria.trim()) newErrors.nuevaCategoria = 'La nueva categoría es requerida';
      else if (formData.nuevaCategoria.trim().length < 2) newErrors.nuevaCategoria = 'La categoría debe tener al menos 2 caracteres';
    } else {
      if (!formData.categoria) newErrors.categoria = 'La categoría es requerida';
    }
    
    if (!formData.precio || formData.precio <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (!formData.stock_critico || formData.stock_critico < 0) newErrors.stock_critico = 'El stock crítico no puede ser negativo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Preparar datos para enviar
    const productoData = {
      // El código se generará automáticamente en handleCreate
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.esNuevaCategoria ? formData.nuevaCategoria : formData.categoria,
      precio: parseInt(formData.precio),
      stock: parseInt(formData.stock),
      stock_critico: parseInt(formData.stock_critico),
      imagen: formData.imagen || imagenPorDefecto
    };

    // Solo agregar estos campos si estamos creando una nueva categoría
    if (formData.esNuevaCategoria) {
      productoData.esNuevaCategoria = true;
      productoData.nuevaCategoria = formData.nuevaCategoria;
    }

    onSubmit(productoData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Mostrar código generado (solo lectura) */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">
              Código del Producto
            </label>
            <div className="form-control bg-light">
              <strong>{codigoGenerado}</strong>
            </div>
            <div className="form-text">
              El código se genera automáticamente según la categoría seleccionada.
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="categoria" className="form-label">
              Categoría *
            </label>
            <select
              className={`form-select ${errors.categoria ? 'is-invalid' : ''}`}
              id="categoria"
              name="categoria"
              value={formData.esNuevaCategoria ? '_nueva' : formData.categoria}
              onChange={handleCategoriaChange}
              disabled={!!producto} // No permitir cambiar categoría en edición
            >
              <option value="">Seleccionar categoría...</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="_nueva">➕ Nueva categoría</option>
            </select>
            {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
          </div>
        </div>
      </div>

      {/* Campo para nueva categoría */}
      {formData.esNuevaCategoria && (
        <div className="mb-3">
          <label htmlFor="nuevaCategoria" className="form-label">
            Nueva Categoría *
          </label>
          <input
            type="text"
            className={`form-control ${errors.nuevaCategoria ? 'is-invalid' : ''}`}
            id="nuevaCategoria"
            name="nuevaCategoria"
            value={formData.nuevaCategoria}
            onChange={handleNuevaCategoriaChange} // ✅ Usar la nueva función
            placeholder="Ej: Libros, Electrónicos, etc."
          />
          {errors.nuevaCategoria && <div className="invalid-feedback">{errors.nuevaCategoria}</div>}
          <div className="form-text">
            Esta categoría se guardará para futuros productos.
          </div>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre del Producto *
        </label>
        <input
          type="text"
          className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Llavero Stardew Valley"
        />
        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">
          Descripción *
        </label>
        <textarea
          className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
          id="descripcion"
          name="descripcion"
          rows="3"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción detallada del producto..."
        />
        {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="precio" className="form-label">
              Precio (CLP) *
            </label>
            <input
              type="number"
              className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              placeholder="5990"
            />
            {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="stock" className="form-label">
              Stock Actual *
            </label>
            <input
              type="number"
              className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              placeholder="50"
            />
            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="stock_critico" className="form-label">
              Stock Crítico *
            </label>
            <input
              type="number"
              className={`form-control ${errors.stock_critico ? 'is-invalid' : ''}`}
              id="stock_critico"
              name="stock_critico"
              value={formData.stock_critico}
              onChange={handleChange}
              min="0"
              placeholder="10"
            />
            {errors.stock_critico && <div className="invalid-feedback">{errors.stock_critico}</div>}
          </div>
        </div>
      </div>

      {/* Sección de imagen */}
      <div className="mb-3">
        <label htmlFor="imagen" className="form-label">
          Imagen del Producto
        </label>
        
        {/* Previsualización de imagen */}
        {imagenPrevia && (
          <div className="mb-2">
            <img 
              src={imagenPrevia} 
              alt="Previsualización" 
              className="img-thumbnail"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = imagenPorDefecto;
              }}
            />
          </div>
        )}

        <div className="input-group">
          <input
            type="file"
            className="form-control"
            id="imagenFile"
            accept="image/*"
            onChange={handleImagenChange}
          />
          <span className="input-group-text">o</span>
          <input
            type="text"
            className="form-control"
            id="imagenUrl"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            placeholder="URL de la imagen o sube un archivo"
          />
        </div>
        <div className="form-text">
          Puedes subir una imagen o ingresar una URL. Si no seleccionas ninguna, se usará la imagen por defecto.
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {producto ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;