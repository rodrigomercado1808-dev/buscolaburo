export function formatDate(value) {
  if (!value) return 'Sin fecha';
  const date = value?.toDate ? value.toDate() : new Date(value);
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(date);
}

export function currencyARS(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'US';
}
