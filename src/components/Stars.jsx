import { Star } from 'lucide-react';

export default function Stars({ value = 0, onChange, size = 18 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            className={onChange ? 'focus-ring rounded-sm' : 'cursor-default'}
            onClick={() => onChange?.(star)}
            aria-label={`${star} estrellas`}
          >
            <Star
              size={size}
              className={active ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}
            />
          </button>
        );
      })}
    </div>
  );
}
