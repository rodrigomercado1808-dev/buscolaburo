import { Ban, CheckCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { banUser, deleteContent, listCollection, unbanUser } from '../services/admin.js';
import { currencyARS, formatDate } from '../utils/format.js';

const tabs = [
  { key: 'users', label: 'Usuarios' },
  { key: 'jobs', label: 'Empleos' },
  { key: 'posts', label: 'Publicaciones' },
  { key: 'payments', label: 'Pagos' },
  { key: 'subscriptions', label: 'Suscripciones' }
];

export default function Admin() {
  const [active, setActive] = useState('users');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setItems(await listCollection(active));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [active]);

  async function remove(collectionName, id) {
    await deleteContent(collectionName, id);
    await load();
  }

  async function toggleBan(user) {
    if (user.status === 'banned') await unbanUser(user.id);
    else await banUser(user.id);
    await load();
  }

  return (
    <section className="page space-y-6">
      <div>
        <h1 className="text-2xl font-black">Admin</h1>
        <p className="text-sm text-slate-600">Usuarios, empleos, publicaciones, pagos, suscripciones y moderación.</p>
      </div>
      <div className="panel flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.key} className={active === tab.key ? 'btn-primary' : 'btn-secondary'} onClick={() => setActive(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="panel overflow-x-auto">
        {loading && <p className="text-sm text-slate-600">Cargando...</p>}
        {!loading && active === 'users' && (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead><tr className="border-b border-line"><th className="py-2">Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Creado</th><th>Acciones</th></tr></thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b border-line">
                  <td className="py-3 font-bold">{user.displayName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <button className={user.status === 'banned' ? 'btn-secondary' : 'btn-danger'} onClick={() => toggleBan(user)}>
                      {user.status === 'banned' ? <CheckCircle size={16} /> : <Ban size={16} />}
                      {user.status === 'banned' ? 'Activar' : 'Banear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && active !== 'users' && (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead><tr className="border-b border-line"><th className="py-2">ID</th><th>Título / Estado</th><th>Importe</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line">
                  <td className="py-3 font-mono text-xs">{item.id}</td>
                  <td className="font-bold">{item.title || item.text || item.status || item.planType || 'Registro'}</td>
                  <td>{item.amount ? currencyARS(item.amount) : '-'}</td>
                  <td>{formatDate(item.createdAt || item.startDate)}</td>
                  <td>
                    {(active === 'jobs' || active === 'posts') && (
                      <button className="btn-danger" onClick={() => remove(active, item.id)}>
                        <Trash2 size={16} />Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
