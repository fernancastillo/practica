import { formatCurrency, formatDate, getEstadoBadge } from '../../utils/admin/dashboardUtils';

const UltimasOrdenes = ({ ordenes }) => {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">
          Últimas Órdenes
        </h6>
        <span className="badge bg-primary">{ordenes.length}</span>
      </div>
      <div className="card-body">
        {ordenes.length === 0 ? (
          <p className="text-muted">No hay órdenes recientes</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-sm" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Orden #</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.numeroOrden}>
                    <td>{orden.numeroOrden}</td>
                    <td>{formatDate(orden.fecha)}</td>
                    <td>{formatCurrency(orden.total)}</td>
                    <td>
                      <span className={`badge ${getEstadoBadge(orden.estadoEnvio)}`}>
                        {orden.estadoEnvio}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UltimasOrdenes;