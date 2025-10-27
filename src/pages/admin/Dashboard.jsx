import { authService } from '../../utils/tienda/auth';
import { useDashboardData } from '../../utils/admin/useDashboardData';
import DashboardStats from '../../components/admin/DashboardStats';
import StockCriticoAlert from '../../components/admin/StockCriticoAlert';
import UltimasOrdenes from '../../components/admin/UltimasOrdenes';
import { calculateTasaEntrega } from '../../utils/admin/dashboardUtils';

const Dashboard = () => {
  const { stats, productosStockCritico, ultimasOrdenes, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  const tasaEntrega = calculateTasaEntrega(stats.ordenesEntregadas, stats.totalOrdenes);

  return (
    <div className="container-fluid">
      {/* Header del Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <div className="text-muted">
          Bienvenido, <strong>{authService.getCurrentUser()?.nombre || 'Administrador'}</strong>
        </div>
      </div>

      {/* Estadísticas */}
      <DashboardStats stats={stats} />

      <div className="row">
        {/* Productos con Stock Crítico */}
        <div className="col-xl-6 col-lg-6">
          <StockCriticoAlert productos={productosStockCritico} />
        </div>

        {/* Últimas Órdenes */}
        <div className="col-xl-6 col-lg-6">
          <UltimasOrdenes ordenes={ultimasOrdenes} />
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <div className="text-white-50 small">Órdenes Entregadas</div>
              <div className="h2 mb-0">{stats.ordenesEntregadas}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              <div className="text-white-50 small">Total Órdenes</div>
              <div className="h2 mb-0">{stats.totalOrdenes}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              <div className="text-white-50 small">Tasa de Entrega</div>
              <div className="h2 mb-0">{tasaEntrega}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;