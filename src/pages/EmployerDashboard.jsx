import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { listenJobs } from '../services/jobs.js';
import { currencyARS } from '../utils/format.js';

export default function EmployerDashboard() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    return listenJobs({ status: 'open' }, (items) => {
      setJobs(items.filter((job) => job.employerId === profile.id));
    });
  }, [profile.id]);

  const totalApplications = jobs.reduce((sum, job) => sum + Number(job.applicationCount || 0), 0);

  return (
    <section className="page space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Dashboard empleador</h1>
          <p className="text-sm text-slate-600">Gestioná vacantes, postulaciones y visibilidad.</p>
        </div>
        <Link className="btn-primary" to="/empleos/crear"><Plus size={16} />Publicar empleo</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel"><p className="text-sm text-slate-600">Empleos abiertos</p><strong className="text-3xl">{jobs.length}</strong></div>
        <div className="panel"><p className="text-sm text-slate-600">Postulaciones</p><strong className="text-3xl">{totalApplications}</strong></div>
        <div className="panel"><p className="text-sm text-slate-600">Estado premium</p><strong className="text-3xl">{profile.premium ? 'Activo' : 'Libre'}</strong></div>
      </div>
      <div className="panel">
        <h2 className="mb-4 text-lg font-black">Tus empleos activos</h2>
        <div className="divide-y divide-line">
          {jobs.map((job) => (
            <Link key={job.id} to={`/empleos/${job.id}`} className="block py-3 hover:bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold">{job.title}</p>
                  <p className="text-sm text-slate-600">{job.location} · {job.mode}</p>
                </div>
                <span className="text-sm font-semibold">{currencyARS(job.salaryMin)} - {currencyARS(job.salaryMax)}</span>
              </div>
            </Link>
          ))}
          {jobs.length === 0 && <p className="text-sm text-slate-600">Todavía no tenés empleos abiertos.</p>}
        </div>
      </div>
    </section>
  );
}
