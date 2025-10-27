export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * Maneja diferentes formatos de fecha que puedan venir del JSON
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    // Si la fecha ya está en formato DD/MM/YYYY, devolverla tal cual
    if (typeof dateString === 'string' && dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        // Validar que sea una fecha válida
        const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        if (!isNaN(date.getTime())) {
          return dateString; // Ya está en el formato correcto
        }
      }
    }
    
    // Intentar parsear como fecha ISO o otros formatos
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      // Si no se puede parsear, intentar con formato DD-MM-YYYY
      const altDate = new Date(dateString.split('-').reverse().join('-'));
      if (!isNaN(altDate.getTime())) {
        return altDate.toLocaleDateString('es-CL');
      }
      return 'Fecha inválida';
    }
    
    // Formatear a DD/MM/YYYY
    return date.toLocaleDateString('es-CL');
  } catch (error) {
    console.error('Error formateando fecha:', dateString, error);
    return 'Error en fecha';
  }
};

export const getEstadoBadge = (estado) => {
  const badgeClasses = {
    'Entregado': 'bg-success',
    'Pendiente': 'bg-warning',
    'Enviado': 'bg-info',
    'Cancelado': 'bg-danger'
  };
  return badgeClasses[estado] || 'bg-secondary';
};

export const calculateTasaEntrega = (entregadas, total) => {
  return total > 0 ? Math.round((entregadas / total) * 100) : 0;
};

export const getProductosPorCategoria = (productos) => {
  return productos.reduce((acc, producto) => {
    acc[producto.categoria] = (acc[producto.categoria] || 0) + 1;
    return acc;
  }, {});
};