import { useEffect } from 'react';
import { authService } from '../../utils/tienda/auth';
import { useDashboardData } from '../../utils/admin/useDashboardData';
import DashboardStats from '../../components/admin/DashboardStats';
import StockCriticoAlert from '../../components/admin/StockCriticoAlert';
import UltimasOrdenes from '../../components/admin/UltimasOrdenes';
import { calculateTasaEntrega } from '../../utils/admin/dashboardUtils';

const Dashboard = () => {
  const { stats, productosStockCritico, ultimasOrdenes, loading } = useDashboardData();

  // Aplicar el fondo al body
  useEffect(() => {
    document.body.style.backgroundImage = 'url("https://images3.alphacoders.com/126/1269904.png")';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    
    // Limpiar cuando el componente se desmonte
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.minHeight = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-white" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  const tasaEntrega = calculateTasaEntrega(stats.ordenesEntregadas, stats.totalOrdenes);

  return (
    <div className="container-fluid" style={{ padding: '20px', minHeight: '100vh' }}>
      {/* Header del Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 text-white fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Dashboard
        </h1>
        <div className="text-white fw-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
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
          <div className="card bg-primary text-white shadow-lg" style={{ opacity: 0.95 }}>
            <div className="card-body">
              <div className="text-white-50 small">Órdenes Entregadas</div>
              <div className="h2 mb-0">{stats.ordenesEntregadas}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card bg-success text-white shadow-lg" style={{ opacity: 0.95 }}>
            <div className="card-body">
              <div className="text-white-50 small">Total Órdenes</div>
              <div className="h2 mb-0">{stats.totalOrdenes}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card bg-info text-white shadow-lg" style={{ opacity: 0.95 }}>
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