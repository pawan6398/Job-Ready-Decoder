import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showPercent = true,
  size = 'md',
  color = 'indigo'
}) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorClasses = {
    indigo: 'bg-brand-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-500'
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-700">
          <span>{label}</span>
          {showPercent && <span>{percent}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color] || colorClasses.indigo}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
