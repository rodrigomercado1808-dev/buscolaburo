import { Check, Edit, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { applyToJob, cancelApplication, closeJob, getJob, removeJob } from '../services/jobs.js';
import { currencyARS, formatDate } from '../utils/format.js';

export default function JobDetail() {
  const { id } = useParams();
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getJob(id).then(setJob);
  }, [id]);

  if (!job) return <Loading />;

  const owner = job.employerId === profile.id || isAdmin;
  const canApply = profile.role === 'candidate' && job.status === 'open';

  async function refresh() {
    setJob(await getJob(id));
  }

  async function handleApply() {
    await applyToJob(job, profile);
    setMessage('Postulación enviada.');
    await refresh();
  }

  async function handleCancel() {
    await cancelApplication(job, profile.id);
    setMessage('Postulación cancelada.');
    await refresh();
  }

  async function handleClose() {
    await closeJob(id);
    await refresh();
  }

  async function handleDelete() {
    await removeJob(id);
    navigate('/empleos');
  }

  return (
    <section className="page space-y-6">
      <div className="panel space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand">{job.company}</p>
            <h1 className="text-3xl font-black">{job.title}</h1>
            <p className="mt-2 text-sm text-slate-600">{job.location} · {job.mode} · {job.contractType}</p>
          </div>
          <span className="rounded-md bg-surface px-3 py-2 text-sm font-bold">{job.status === 'open' ? 'Abierto' : 'Cerrado'}</span>
        </div>
        <p className="font-bold">{currencyARS(job.salaryMin)} - {currencyARS(job.salaryMax)}</p>
        <div className="flex flex-wrap gap-2">
          {(job.tags || []).map((tag) => <span key={tag} className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-brand">{tag}</span>)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="font-black">Descripción</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{job.description}</p>
          </div>
          <div>
            <h2 className="font-black">Requisitos</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{job.requirements}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">Publicado: {formatDate(job.createdAt)} · Postulaciones: {job.applicationCount || 0}</p>
        {message && <p className="rounded-md bg-teal-50 p-3 text-sm text-teal-800">{message}</p>}
        <div className="flex flex-wrap gap-2">
          {canApply && <button className="btn-primary" onClick={handleApply}><Check size={16} />Postularme</button>}
          {canApply && <button className="btn-secondary" onClick={handleCancel}><X size={16} />Cancelar postulación</button>}
          {owner && <Link className="btn-secondary" to={`/empleos/${id}/editar`}><Edit size={16} />Editar</Link>}
          {owner && job.status === 'open' && <button className="btn-secondary" onClick={handleClose}>Cerrar empleo</button>}
          {owner && <button className="btn-danger" onClick={handleDelete}><Trash2 size={16} />Eliminar</button>}
        </div>
      </div>
    </section>
  );
}
