// src/components/admin/UsuariosStats.jsx
import { formatCurrency } from '../../utils/admin/dashboardUtils';

const UsuariosStats = ({ estadisticas }) => {
  const statCards = [
    {
      title: 'Total Usuarios',
      value: estadisticas.totalUsuarios,
      icon: 'bi-people-fill',
      color: 'primary',
      border: 'border-left-primary'
    },
    {
      title: 'Clientes',
      value: estadisticas.totalClientes,
      icon: 'bi-person',
      color: 'info',
      border: 'border-left-info'
    },
    {
      title: 'Administradores',
      value: estadisticas.totalAdmins,
      icon: 'bi-shield-check',
      color: 'warning',
      border: 'border-left-warning'
    },
    {
      title: 'Con Compras',
      value: estadisticas.usuariosConCompras,
      icon: 'bi-cart-check',
      color: 'secondary',
      border: 'border-left-secondary'
    },
    {
      title: 'Sin Compras',
      value: estadisticas.totalUsuarios - estadisticas.usuariosConCompras,
      icon: 'bi-cart-x',
      color: 'danger',
      border: 'border-left-light'
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
      
      {/* Usuario Top */}
      {estadisticas.usuarioTop && estadisticas.usuarioTop.nombre && (
        <div className="col-xl-2 col-md-4 mb-4">
          <div className="card border-left-dark shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                    Cliente Top
                  </div>
                  <div className="h6 mb-0 font-weight-bold text-gray-800">
                    {estadisticas.usuarioTop.nombre}
                  </div>
                  <div className="text-xs text-muted">
                    {formatCurrency(estadisticas.usuarioTop.totalGastado)}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-trophy fa-2x text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosStats;