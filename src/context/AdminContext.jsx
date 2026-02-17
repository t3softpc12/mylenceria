import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // adjust path to your auth context

const AdminContext = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/mylenceriaadmin" replace />;
  }

  return <Outlet />;
};

export default AdminContext;