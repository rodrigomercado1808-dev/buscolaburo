import { Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function EditProfile() {
  const { profile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    displayName: profile.displayName || '',
    headline: profile.headline || '',
    location: profile.location || '',
    bio: profile.bio || '',
    skills: (profile.skills || []).join(', ')
  });

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await updateUserProfile({
      ...values,
      skills: values.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    });
    navigate('/perfil');
  }

  return (
    <section className="page space-y-6">
      <h1 className="text-2xl font-black">Editar perfil</h1>
      <form className="panel space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">
            Nombre
            <input className="field mt-1" value={values.displayName} onChange={(event) => update('displayName', event.target.value)} required />
          </label>
          <label className="text-sm font-semibold">
            Titular
            <input className="field mt-1" value={values.headline} onChange={(event) => update('headline', event.target.value)} />
          </label>
          <label className="text-sm font-semibold">
            Ubicación
            <input className="field mt-1" value={values.location} onChange={(event) => update('location', event.target.value)} />
          </label>
          <label className="text-sm font-semibold">
            Habilidades
            <input className="field mt-1" value={values.skills} onChange={(event) => update('skills', event.target.value)} />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Bio
          <textarea className="field mt-1 min-h-32" value={values.bio} onChange={(event) => update('bio', event.target.value)} />
        </label>
        <button className="btn-primary"><Save size={16} />Guardar perfil</button>
      </form>
    </section>
  );
}
