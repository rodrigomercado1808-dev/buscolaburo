import { Chrome, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { login, continueWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/dashboard');
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
      await continueWithGoogle('candidate');
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4 text-ink">
      <form className="panel w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div>
          <Link className="text-sm font-black uppercase tracking-wide text-brand" to="/">Busco Laburo</Link>
          <h1 className="mt-3 text-2xl font-black">Ingresar</h1>
        </div>
        {error && <p className="rounded-md border border-red-500/30 bg-red-950/50 p-3 text-sm text-red-100">{error}</p>}
        <label className="block text-sm font-semibold">
          Email
          <input className="field mt-1" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block text-sm font-semibold">
          Contraseña
          <input className="field mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button className="btn-primary w-full" disabled={loading}>
          <LogIn size={16} />
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
        <button className="btn-secondary w-full" type="button" onClick={handleGoogle} disabled={loading}>
          <Chrome size={16} />
          Continuar con Google
        </button>
        <div className="flex items-center justify-between text-sm">
          <Link className="font-semibold text-brand" to="/recuperar">Recuperar contraseña</Link>
          <Link className="font-semibold text-brand" to="/registro">Crear cuenta</Link>
        </div>
      </form>
    </main>
  );
}
