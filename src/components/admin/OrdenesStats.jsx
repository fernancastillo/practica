import { formatCurrency } from '../../utils/admin/dashboardUtils';

const OrdenesStats = ({ estadisticas }) => {
  const statCards = [
    {
      title: 'Total Órdenes',
      value: estadisticas.totalOrdenes,
      icon: 'bi-cart-check',
      color: 'primary',
      border: 'border-left-primary'
    },
    {
      title: 'Pendientes',
      value: estadisticas.pendientes,
      icon: 'bi-clock-history',
      color: 'warning',
      border: 'border-left-warning'
    },
    {
      title: 'Enviadas',
      value: estadisticas.enviadas,
      icon: 'bi-truck',
      color: 'info',
      border: 'border-left-info'
    },
    {
      title: 'Entregadas',
      value: estadisticas.entregadas,
      icon: 'bi-check-circle',
      color: 'success',
      border: 'border-left-success'
    },
    {
      title: 'Canceladas',
      value: estadisticas.canceladas,
      icon: 'bi-x-circle',
      color: 'danger',
      border: 'border-left-danger'
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(estadisticas.ingresosTotales),
      icon: 'bi-currency-dollar',
      color: 'secondary',
      border: 'border-left-secondary'
    }
  ];

  return (
    <div className="row mb-4">
      {statCards.map((card, index) => (
        <div key={index} className="col-xl-2 col-md-4 mb-4">
          <div className={`card ${card.border} shadow h-100 py-2`}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className={`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`}>
                    {card.title}
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {card.value}
                  </div>
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

export default OrdenesStats;