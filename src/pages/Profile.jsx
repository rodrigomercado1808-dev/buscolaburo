import { Edit, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import Stars from '../components/Stars.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getProfile } from '../services/profiles.js';
import { rateUser } from '../services/ratings.js';
import { startConversation } from '../services/messages.js';

export default function Profile() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [viewed, setViewed] = useState(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  const targetId = id || profile.id;

  useEffect(() => {
    getProfile(targetId).then(setViewed);
  }, [targetId]);

  if (!viewed) return <Loading />;

  const ownProfile = viewed.id === profile.id;

  async function handleRate(event) {
    event.preventDefault();
    await rateUser({ targetUserId: viewed.id, author: profile, score, comment });
    setComment('');
    setViewed(await getProfile(viewed.id));
  }

  async function handleMessage() {
    const conversationId = await startConversation(profile, viewed);
    navigate('/mensajes', { state: { conversationId } });
  }

  return (
    <section className="page space-y-6">
      <div className="panel space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-brand">{viewed.role === 'employer' ? 'Empleador' : viewed.role === 'admin' ? 'Admin' : 'Candidato'}</p>
            <h1 className="text-3xl font-black">{viewed.displayName}</h1>
            <p className="mt-1 text-slate-600">{viewed.headline || viewed.email}</p>
          </div>
          <div className="flex gap-2">
            {ownProfile && <Link className="btn-primary" to="/perfil/editar"><Edit size={16} />Editar</Link>}
            {!ownProfile && <button className="btn-secondary" onClick={handleMessage}><MessageCircle size={16} />Mensaje</button>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Stars value={viewed.ratingAverage || 0} />
          <span className="text-sm font-semibold">{Number(viewed.ratingAverage || 0).toFixed(1)} ({viewed.ratingCount || 0} valoraciones)</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md bg-surface p-4">
            <p className="text-sm font-semibold text-slate-600">Ubicación</p>
            <p className="font-bold">{viewed.location || 'Sin ubicación'}</p>
          </div>
          <div className="rounded-md bg-surface p-4">
            <p className="text-sm font-semibold text-slate-600">Plan</p>
            <p className="font-bold">{viewed.premium ? 'Premium' : 'Libre'}</p>
          </div>
          <div className="rounded-md bg-surface p-4">
            <p className="text-sm font-semibold text-slate-600">Estado</p>
            <p className="font-bold">{viewed.status}</p>
          </div>
        </div>
        <div>
          <h2 className="font-black">Bio</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{viewed.bio || 'Sin biografía cargada.'}</p>
        </div>
        <div>
          <h2 className="font-black">Habilidades</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {(viewed.skills || []).map((skill) => <span key={skill} className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-brand">{skill}</span>)}
            {(viewed.skills || []).length === 0 && <p className="text-sm text-slate-600">Sin habilidades cargadas.</p>}
          </div>
        </div>
      </div>

      {!ownProfile && (
        <form className="panel space-y-4" onSubmit={handleRate}>
          <h2 className="text-lg font-black">Valorar perfil</h2>
          <Stars value={score} onChange={setScore} />
          <textarea className="field min-h-24" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Comentario opcional" />
          <button className="btn-primary">Enviar valoración</button>
        </form>
      )}
    </section>
  );
}
