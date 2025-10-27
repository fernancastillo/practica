const StockCriticoAlert = ({ productos }) => {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-danger">
          Productos con Stock Crítico
        </h6>
        <span className="badge bg-danger">{productos.length}</span>
      </div>
      <div className="card-body">
        {productos.length === 0 ? (
          <p className="text-muted">No hay productos con stock crítico</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-sm" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Stock Crítico</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.codigo}>
                    <td>{producto.nombre}</td>
                    <td>
                      <span className={`badge ${producto.stock === 0 ? 'bg-danger' : 'bg-warning'}`}>
                        {producto.stock}
                      </span>
                    </td>
                    <td>{producto.stock_critico}</td>
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

export default StockCriticoAlert;