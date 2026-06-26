import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import Admin from './pages/Admin.jsx';
import CandidateDashboard from './pages/CandidateDashboard.jsx';
import CreateJob from './pages/CreateJob.jsx';
import EditJob from './pages/EditJob.jsx';
import EditProfile from './pages/EditProfile.jsx';
import EmployerDashboard from './pages/EmployerDashboard.jsx';
import Feed from './pages/Feed.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import JobDetail from './pages/JobDetail.jsx';
import Jobs from './pages/Jobs.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Messages from './pages/Messages.jsx';
import Notifications from './pages/Notifications.jsx';
import Premium from './pages/Premium.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import Settings from './pages/Settings.jsx';

function DashboardRedirect() {
  const { isEmployer, isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isEmployer) return <EmployerDashboard />;
  return <CandidateDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/perfil/editar" element={<EditProfile />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/:id" element={<Profile />} />
          <Route path="/empleos" element={<Jobs />} />
          <Route path="/empleos/:id" element={<JobDetail />} />
          <Route path="/empleos/:id/editar" element={<EditJob />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/mensajes" element={<Messages />} />
          <Route path="/notificaciones" element={<Notifications />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/configuracion" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['employer', 'admin']} requireVerified />}>
        <Route element={<AppLayout />}>
          <Route path="/empleos/crear" element={<CreateJob />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
