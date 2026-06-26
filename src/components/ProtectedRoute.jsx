import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Loading from './Loading.jsx';

export default function ProtectedRoute({ roles = [], requireVerified = false }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (profile?.status === 'banned') return <Navigate to="/configuracion" replace />;
  if (requireVerified && !user.emailVerified) return <Navigate to="/configuracion" replace />;
  if (roles.length > 0 && !roles.includes(profile?.role)) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
