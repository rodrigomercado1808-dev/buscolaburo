import { MailCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Settings() {
  const { user, profile, resendVerification, logout } = useAuth();
  const [message, setMessage] = useState('');

  async function handleVerify() {
    await resendVerification();
    setMessage('Email de verificación enviado.');
  }

  return (
    <section className="page space-y-6">
      <h1 className="text-2xl font-black">Configuración</h1>
      <div className="panel space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-surface p-4">
            <p className="text-sm text-slate-600">Email</p>
            <p className="font-bold">{user.email}</p>
          </div>
          <div className="rounded-md bg-surface p-4">
            <p className="text-sm text-slate-600">Verificación</p>
            <p className="font-bold">{user.emailVerified ? 'Verificado' : 'Pendiente'}</p>
          </div>
          <div className="rounded-md bg-surface p-4">
            <p className="text-sm text-slate-600">Rol</p>
            <p className="font-bold">{profile.role}</p>
          </div>
          <div className="rounded-md bg-surface p-4">
            <p className="text-sm text-slate-600">Estado</p>
            <p className="font-bold">{profile.status}</p>
          </div>
        </div>
        {message && <p className="rounded-md bg-teal-50 p-3 text-sm text-teal-800">{message}</p>}
        {!user.emailVerified && <button className="btn-primary" onClick={handleVerify}><MailCheck size={16} />Reenviar verificación</button>}
        <button className="btn-secondary" onClick={logout}>Cerrar sesión</button>
      </div>
    </section>
  );
}
