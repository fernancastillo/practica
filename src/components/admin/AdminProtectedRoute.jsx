import { Navigate, useLocation } from 'react-router-dom';
import { canAccessAdmin, getRedirectRoute } from '../../utils/admin/routeProtection';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  const redirectTo = getRedirectRoute();
  
  if (redirectTo) {
    // Redirigir guardando la ubicación intentada
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Si puede acceder, mostrar el contenido
  return children;
};

export default AdminProtectedRoute;