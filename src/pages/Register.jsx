import { Chrome, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Register() {
  const { register, continueWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ displayName: '', email: '', password: '', role: 'candidate' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(values);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError('');
    try {
      await continueWithGoogle(values.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4 text-ink">
      <form className="panel w-full max-w-lg space-y-4" onSubmit={handleSubmit}>
        <div>
          <Link className="text-sm font-black uppercase tracking-wide text-brand" to="/">Busco Laburo</Link>
          <h1 className="mt-3 text-2xl font-black">Crear cuenta</h1>
        </div>
        {error && <p className="rounded-md border border-red-500/30 bg-red-950/50 p-3 text-sm text-red-100">{error}</p>}
        <label className="block text-sm font-semibold">
          Nombre
          <input className="field mt-1" value={values.displayName} onChange={(event) => update('displayName', event.target.value)} required />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input className="field mt-1" type="email" value={values.email} onChange={(event) => update('email', event.target.value)} required />
        </label>
        <label className="block text-sm font-semibold">
          Contraseña
          <input className="field mt-1" type="password" minLength="6" value={values.password} onChange={(event) => update('password', event.target.value)} required />
        </label>
        <label className="block text-sm font-semibold">
          Tipo de cuenta
          <select className="field mt-1" value={values.role} onChange={(event) => update('role', event.target.value)}>
            <option value="candidate">Candidato</option>
            <option value="employer">Empleador</option>
          </select>
        </label>
        <button className="btn-primary w-full" disabled={loading}>
          <UserPlus size={16} />
          {loading ? 'Creando...' : 'Registrarme'}
        </button>
        <button className="btn-secondary w-full" type="button" onClick={handleGoogle} disabled={loading}>
          <Chrome size={16} />
          Registrarme con Google
        </button>
        <p className="text-center text-sm">
          ¿Ya tenés cuenta? <Link className="font-semibold text-brand" to="/login">Ingresar</Link>
        </p>
      </form>
    </main>
  );
}
