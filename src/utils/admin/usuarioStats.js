// src/utils/admin/usuarioStats.js
export const calcularEstadisticasUsuarios = (usuarios, ordenes = []) => {
  const totalUsuarios = usuarios.length;
  const totalClientes = usuarios.filter(u => u.tipo === 'Cliente').length;
  const totalAdmins = usuarios.filter(u => u.tipo === 'Admin').length;
  const usuariosConCompras = usuarios.filter(u => u.totalCompras > 0).length;
  
  // Calcular ingresos totales basados en las órdenes existentes, no en los usuarios
  // Esto asegura que los ingresos no cambien al eliminar usuarios
  let totalIngresos = 0;
  try {
    const storedOrdenes = localStorage.getItem('app_ordenes');
    if (storedOrdenes) {
      const todasLasOrdenes = JSON.parse(storedOrdenes);
      // Sumar solo las órdenes que están en estado "Entregado" o similar
      totalIngresos = todasLasOrdenes
        .filter(orden => orden.estadoEnvio === 'Entregado' || orden.estado === 'Entregado')
        .reduce((sum, orden) => sum + orden.total, 0);
    } else {
      // Fallback: calcular desde usuarios si no hay órdenes en localStorage
      totalIngresos = usuarios.reduce((sum, usuario) => sum + usuario.totalGastado, 0);
    }
  } catch (error) {
    console.warn('Error calculando ingresos desde órdenes, usando datos de usuarios:', error);
    totalIngresos = usuarios.reduce((sum, usuario) => sum + usuario.totalGastado, 0);
  }
  
  // Usuario con más compras (excluyendo admins)
  const clientes = usuarios.filter(u => u.tipo === 'Cliente');
  const usuarioTop = clientes.reduce((max, usuario) => 
    usuario.totalGastado > max.totalGastado ? usuario : max, 
    { totalGastado: -1, nombre: 'Ninguno' }
  );

  return {
    totalUsuarios,
    totalClientes,
    totalAdmins,
    usuariosConCompras,
    totalIngresos,
    usuarioTop: usuarioTop.totalGastado > 0 ? usuarioTop : null
  };
};

export const aplicarFiltrosUsuarios = (usuarios, filtros) => {
  let filtered = [...usuarios];

  if (filtros.run) {
    filtered = filtered.filter(usuario => 
      usuario.run.includes(filtros.run)
    );
  }

  if (filtros.nombre) {
    filtered = filtered.filter(usuario => 
      usuario.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(filtros.nombre.toLowerCase())
    );
  }

  if (filtros.email) {
    filtered = filtered.filter(usuario => 
      usuario.correo.toLowerCase().includes(filtros.email.toLowerCase())
    );
  }

  if (filtros.tipo) {
    filtered = filtered.filter(usuario => 
      usuario.tipo === filtros.tipo
    );
  }

  return filtered;
};