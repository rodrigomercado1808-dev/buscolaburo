import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { listenNotifications, markNotificationRead } from '../services/notifications.js';
import { formatDate } from '../utils/format.js';

export default function Notifications() {
  const { profile } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => listenNotifications(profile.id, setItems), [profile.id]);

  return (
    <section className="page space-y-6">
      <h1 className="text-2xl font-black">Notificaciones</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className={`panel ${item.read ? 'opacity-70' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-brand">{item.type}</p>
                <h2 className="font-black">{item.title}</h2>
                <p className="text-sm text-slate-700">{item.body}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                {item.link && <Link className="btn-secondary" to={item.link}>Abrir</Link>}
                {!item.read && <button className="btn-primary" onClick={() => markNotificationRead(item.id)}><Check size={16} />Leída</button>}
              </div>
            </div>
          </article>
        ))}
        {items.length === 0 && <div className="panel text-sm text-slate-600">No tenés notificaciones.</div>}
      </div>
    </section>
  );
}
