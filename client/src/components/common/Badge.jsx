import React from 'react';

export default function Badge({ variant = 'default', children, className = '' }) {
  const variants = {
    // Classification Badges
    'Already Have': 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
    'Need to Learn': 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
    'Need to Demonstrate': 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
    'Not Important for Me': 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-600/10',

    // Frequency Badges
    '3/3': 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold',
    '2/3': 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',

    // Confidence Badges
    High: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-rose-50 text-rose-700 border-rose-200',

    // Category / General
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const styleClass = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs transition-colors ${styleClass} ${className}`}
    >
      {children}
    </span>
  );
}
