import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createJob } from '../services/jobs.js';

export default function CreateJob() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const ref = await createJob(values, profile);
    navigate(`/empleos/${ref.id}`);
  }

  return (
    <section className="page space-y-6">
      <h1 className="text-2xl font-black">Crear empleo</h1>
      <JobForm onSubmit={handleSubmit} submitLabel="Publicar empleo" />
    </section>
  );
}
