import { CreditCard, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createCheckoutPreference, listenSubscription } from '../services/subscriptions.js';
import { currencyARS, formatDate } from '../utils/format.js';

const plans = [
  { type: 'monthly', name: 'Mensual', amount: 4999, description: 'Visibilidad premium y prioridad en búsquedas durante 30 días.' },
  { type: 'quarterly', name: 'Trimestral', amount: 12999, description: 'Ahorro por tres meses con renovación manual o automática desde Mercado Pago.' }
];

export default function Premium() {
  const { profile } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState('');

  useEffect(() => listenSubscription(profile.id, setSubscription), [profile.id]);

  async function checkout(planType) {
    setLoadingPlan(planType);
    try {
      const preference = await createCheckoutPreference(planType);
      window.location.href = preference.initPoint;
    } finally {
      setLoadingPlan('');
    }
  }

  return (
    <section className="page space-y-6">
      <div>
        <h1 className="text-2xl font-black">Premium</h1>
        <p className="text-sm text-slate-600">Checkout Pro, activación por webhook y suscripciones en Firestore.</p>
      </div>
      {subscription && (
        <div className="panel flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand">Suscripción actual</p>
            <h2 className="text-xl font-black">{subscription.planType} · {subscription.status}</h2>
            <p className="text-sm text-slate-600">Vence: {formatDate(subscription.expirationDate)}</p>
          </div>
          <ShieldCheck className="text-brand" size={34} />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.type} className="panel space-y-4">
            <div>
              <h2 className="text-xl font-black">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
            </div>
            <p className="text-3xl font-black">{currencyARS(plan.amount)}</p>
            <button className="btn-primary" onClick={() => checkout(plan.type)} disabled={Boolean(loadingPlan)}>
              <CreditCard size={16} />
              {loadingPlan === plan.type ? 'Creando checkout...' : 'Pagar con Mercado Pago'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
