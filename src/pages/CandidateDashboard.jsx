import { Briefcase, MessageCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getMyApplications, listenJobs } from '../services/jobs.js';

export default function CandidateDashboard() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => listenJobs({ status: 'open' }, (items) => setJobs(items.slice(0, 5))), []);

  useEffect(() => {
    getMyApplications(profile.id).then(setApplications);
  }, [profile.id]);

  return (
    <section className="page space-y-6">
      <div>
        <h1 className="text-2xl font-black">Dashboard candidato</h1>
        <p className="text-sm text-slate-600">Encontrá oportunidades, conversá y fortalecé tu reputación.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel"><Briefcase className="mb-3 text-brand" /><p className="text-sm text-slate-600">Postulaciones</p><strong className="text-3xl">{applications.length}</strong></div>
        <div className="panel"><Star className="mb-3 text-amber-500" /><p className="text-sm text-slate-600">Reputación</p><strong className="text-3xl">{Number(profile.ratingAverage || 0).toFixed(1)}</strong></div>
        <div className="panel"><MessageCircle className="mb-3 text-accent" /><p className="text-sm text-slate-600">Perfil</p><strong className="text-3xl">{profile.premium ? 'Premium' : 'Libre'}</strong></div>
      </div>
      <div className="panel">
        <h2 className="mb-4 text-lg font-black">Oportunidades recientes</h2>
        <div className="grid gap-3">
          {jobs.map((job) => (
            <Link key={job.id} className="rounded-md border border-line p-4 hover:bg-surface" to={`/empleos/${job.id}`}>
              <p className="font-bold">{job.title}</p>
              <p className="text-sm text-slate-600">{job.company} · {job.location} · {job.mode}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
