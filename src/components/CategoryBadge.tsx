import React from 'react';
import { IndicationCategory } from '../types';
import { Pill, Droplets, HeartPulse, AlertTriangle, Info } from 'lucide-react';

interface CategoryBadgeProps {
  category: IndicationCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  switch (category) {
    case 'medication':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${sizeClasses}`}>
          <Pill className={iconSize} />
          Medicamento
        </span>
      );
    case 'hydration':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 ${sizeClasses}`}>
          <Droplets className={iconSize} />
          Hidratación
        </span>
      );
    case 'lifestyle':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
          <HeartPulse className={iconSize} />
          Estilo de Vida
        </span>
      );
    case 'warning':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <AlertTriangle className={iconSize} />
          Precaución / Alerta
        </span>
      );
    case 'general':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <Info className={iconSize} />
          General
        </span>
      );
  }
};
