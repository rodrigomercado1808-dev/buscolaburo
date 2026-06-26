import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import JobForm from '../components/JobForm.jsx';
import { getJob, updateJob } from '../services/jobs.js';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJob(id).then(setJob);
  }, [id]);

  if (!job) return <Loading />;

  async function handleSubmit(values) {
    await updateJob(id, values);
    navigate(`/empleos/${id}`);
  }

  return (
    <section className="page space-y-6">
      <h1 className="text-2xl font-black">Editar empleo</h1>
      <JobForm defaultValues={job} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
    </section>
  );
}
