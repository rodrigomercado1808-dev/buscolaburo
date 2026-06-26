import { Briefcase, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="min-h-screen bg-surface text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.20)_100%)]" />
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_76%_18%,rgba(214,41,118,.38),transparent_30%),radial-gradient(circle_at_86%_70%,rgba(24,119,242,.32),transparent_34%),linear-gradient(135deg,#e50914_0%,transparent_26%)]" />
        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl content-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="space-y-7">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-brand">Busco Laburo</p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              El feed donde el próximo laburo te encuentra mirando.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200">
              Búsquedas laborales con ritmo de red social, perfiles con reputación y conversaciones en tiempo real para candidatos y empresas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" to="/registro">Crear cuenta</Link>
              <Link className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20" to="/login">Ingresar</Link>
            </div>
          </div>
          <div className="grid content-center gap-3 md:grid-cols-2">
            {[
              ['Laburo en cartelera', 'Búsqueda, filtros, postulaciones y cierre de vacantes.', Briefcase],
              ['Feed de oportunidades', 'Publicaciones, imágenes, likes y comentarios en vivo.', MessageSquare],
              ['Reputación', 'Calificaciones de 1 a 5 estrellas con promedio automático.', Star],
              ['Premium', 'Checkout Pro con activación automática por webhook.', ShieldCheck]
            ].map(([title, text, Icon]) => (
              <div key={title} className="rounded-lg border border-white/15 bg-black/42 p-4 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:border-brand">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-[linear-gradient(135deg,#e50914,#d62976,#1877f2)] text-white">
                  <Icon size={21} />
                </div>
                <h2 className="font-bold">{title}</h2>
                <p className="mt-1 text-sm text-slate-200">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
