import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((user as any)?.role !== 'admin') {
    toast.error('No tienes permisos para acceder a esta sección');
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
