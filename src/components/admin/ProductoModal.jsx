import ProductoForm from './ProductoForm';
import { generarBoletaOrden } from '../../utils/admin/boletaUtils';

const ProductoModal = ({ show, producto, categorias, getCodigoAutomatico, onSave, onClose }) => {
  if (!show) return null;

  const handleSubmit = (productoData) => {
    onSave(productoData);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {producto ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ProductoForm
              producto={producto}
              categorias={categorias}
              getCodigoAutomatico={getCodigoAutomatico}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;