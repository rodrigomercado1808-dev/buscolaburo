import { Save } from 'lucide-react';
import { useState } from 'react';

const initialValues = {
  title: '',
  company: '',
  location: '',
  mode: 'Presencial',
  contractType: 'Tiempo completo',
  salaryMin: '',
  salaryMax: '',
  tags: '',
  description: '',
  requirements: ''
};

export default function JobForm({ defaultValues = {}, onSubmit, submitLabel = 'Guardar empleo' }) {
  const [values, setValues] = useState({ ...initialValues, ...defaultValues, tags: (defaultValues.tags || []).join(', ') });
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...values,
        tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Título
          <input className="field mt-1" value={values.title} onChange={(event) => update('title', event.target.value)} required />
        </label>
        <label className="text-sm font-semibold">
          Empresa
          <input className="field mt-1" value={values.company} onChange={(event) => update('company', event.target.value)} required />
        </label>
        <label className="text-sm font-semibold">
          Ubicación
          <input className="field mt-1" value={values.location} onChange={(event) => update('location', event.target.value)} required />
        </label>
        <label className="text-sm font-semibold">
          Modalidad
          <select className="field mt-1" value={values.mode} onChange={(event) => update('mode', event.target.value)}>
            <option>Presencial</option>
            <option>Remoto</option>
            <option>Híbrido</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Contrato
          <select className="field mt-1" value={values.contractType} onChange={(event) => update('contractType', event.target.value)}>
            <option>Tiempo completo</option>
            <option>Medio tiempo</option>
            <option>Freelance</option>
            <option>Temporal</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Etiquetas
          <input className="field mt-1" value={values.tags} onChange={(event) => update('tags', event.target.value)} placeholder="React, Ventas, Diseño" />
        </label>
        <label className="text-sm font-semibold">
          Salario mínimo
          <input className="field mt-1" type="number" value={values.salaryMin} onChange={(event) => update('salaryMin', event.target.value)} />
        </label>
        <label className="text-sm font-semibold">
          Salario máximo
          <input className="field mt-1" type="number" value={values.salaryMax} onChange={(event) => update('salaryMax', event.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Descripción
        <textarea className="field mt-1 min-h-32" value={values.description} onChange={(event) => update('description', event.target.value)} required />
      </label>
      <label className="block text-sm font-semibold">
        Requisitos
        <textarea className="field mt-1 min-h-28" value={values.requirements} onChange={(event) => update('requirements', event.target.value)} required />
      </label>
      <button className="btn-primary" disabled={saving}>
        <Save size={16} />
        {saving ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}
