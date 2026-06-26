import { Bell, Briefcase, Home, LogOut, Menu, MessageCircle, Settings, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/empleos', label: 'Empleos', icon: Briefcase },
  { to: '/feed', label: 'Feed', icon: MessageCircle },
  { to: '/mensajes', label: 'Mensajes', icon: MessageCircle },
  { to: '/notificaciones', label: 'Notificaciones', icon: Bell },
  { to: '/perfil', label: 'Perfil', icon: User },
  { to: '/premium', label: 'Premium', icon: Shield },
  { to: '/configuracion', label: 'Configuración', icon: Settings }
];

export default function AppLayout() {
  const { profile, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="text-lg font-black uppercase tracking-wide text-white">
            <span className="text-brand">Busco</span> Laburo
          </Link>
          <button className="btn-secondary md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">
            <Menu size={18} />
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-slate-600">{profile?.displayName}</span>
            <button className="btn-secondary" onClick={handleLogout}>
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className={`${open ? 'block' : 'hidden'} border-r border-line bg-black/55 p-3 backdrop-blur md:block`}>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${
                    isActive ? 'bg-brand text-white shadow-glow' : 'text-slate-200 hover:bg-white/10'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${
                    isActive ? 'bg-brand text-white shadow-glow' : 'text-slate-200 hover:bg-white/10'
                  }`
                }
              >
                <Shield size={17} />
                Admin
              </NavLink>
            )}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
