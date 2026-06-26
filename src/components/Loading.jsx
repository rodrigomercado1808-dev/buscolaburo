export default function Loading({ label = 'Cargando...' }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm font-medium text-slate-600">
      {label}
    </div>
  );
}
