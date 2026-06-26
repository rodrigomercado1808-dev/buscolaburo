import { Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await resetPassword(email);
      setMessage('Te enviamos un enlace para recuperar tu contraseña.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4 text-ink">
      <form className="panel w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <Link className="text-sm font-bold text-brand" to="/login">Volver al login</Link>
        <h1 className="text-2xl font-black">Recuperar contraseña</h1>
        {message && <p className="rounded-md border border-blue-400/30 bg-blue-950/50 p-3 text-sm text-blue-100">{message}</p>}
        {error && <p className="rounded-md border border-red-500/30 bg-red-950/50 p-3 text-sm text-red-100">{error}</p>}
        <label className="block text-sm font-semibold">
          Email
          <input className="field mt-1" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button className="btn-primary w-full">
          <Mail size={16} />
          Enviar enlace
        </button>
      </form>
    </main>
  );
}
