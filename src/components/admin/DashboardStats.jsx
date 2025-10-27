// src/components/admin/DashboardStats.jsx
import { formatCurrency } from '../../utils/admin/dashboardUtils';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsuarios,
      icon: 'bi-people-fill',
      color: 'primary',
      border: 'border-left-primary'
    },
    {
      title: 'Total Productos',
      value: stats.totalProductos,
      icon: 'bi-box-seam',
      color: 'success',
      border: 'border-left-success'
    },
    {
      title: 'Órdenes Pendientes',
      value: stats.ordenesPendientes,
      icon: 'bi-clock-history',
      color: 'warning',
      border: 'border-left-warning'
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(stats.ingresosTotales),
      icon: 'bi-currency-dollar',
      color: 'info',
      border: 'border-left-info'
    }
  ];

  return (
    <div className="row">
      {statCards.map((card, index) => (
        <div key={index} className="col-xl-3 col-md-6 mb-4">
          <div 
            className={`card ${card.border} shadow h-100 py-2`}
            title={card.tooltip || ''}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className={`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`}>
                    {card.title}
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {card.value}
                  </div>
                  {card.tooltip && (
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      {card.title.includes('Entregados') ? 'Coincide con órdenes/usuarios' : 'Incluye todas las órdenes'}
                    </small>
                  )}
                </div>
                <div className="col-auto">
                  <i className={`bi ${card.icon} fa-2x text-gray-300`}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;