import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { listenJobs } from '../services/jobs.js';
import { currencyARS } from '../utils/format.js';

export default function Jobs() {
  const { isEmployer, isAdmin } = useAuth();
  const [filters, setFilters] = useState({ term: '', location: '', status: 'open' });
  const [jobs, setJobs] = useState([]);

  useEffect(() => listenJobs(filters, setJobs), [filters]);

  return (
    <section className="page space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Empleos</h1>
          <p className="text-sm text-slate-600">Buscá por título, empresa, descripción, etiquetas o ubicación.</p>
        </div>
        {(isEmployer || isAdmin) && <Link className="btn-primary" to="/empleos/crear"><Plus size={16} />Crear empleo</Link>}
      </div>

      <div className="panel grid gap-3 md:grid-cols-[1fr_1fr_180px]">
        <label className="text-sm font-semibold">
          <Search className="mb-1 inline" size={16} /> Buscar
          <input className="field mt-1" value={filters.term} onChange={(event) => setFilters({ ...filters, term: event.target.value })} />
        </label>
        <label className="text-sm font-semibold">
          Ubicación
          <input className="field mt-1" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} />
        </label>
        <label className="text-sm font-semibold">
          Estado
          <select className="field mt-1" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="open">Abiertos</option>
            <option value="closed">Cerrados</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Link key={job.id} to={`/empleos/${job.id}`} className="panel block hover:border-brand">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">{job.title}</h2>
                <p className="text-sm text-slate-600">{job.company} · {job.location} · {job.mode}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(job.tags || []).map((tag) => <span key={tag} className="rounded-md bg-surface px-2 py-1 text-xs font-semibold">{tag}</span>)}
                </div>
              </div>
              <p className="text-sm font-bold">{currencyARS(job.salaryMin)} - {currencyARS(job.salaryMax)}</p>
            </div>
          </Link>
        ))}
        {jobs.length === 0 && <div className="panel text-sm text-slate-600">No encontramos empleos con esos filtros.</div>}
      </div>
    </section>
  );
}
