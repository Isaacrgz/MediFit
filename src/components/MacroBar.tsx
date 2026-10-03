import React from 'react';

interface MacroBarProps {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export const MacroBar: React.FC<MacroBarProps> = ({
  calories,
  proteinGrams,
  carbsGrams,
  fatGrams
}) => {
  const proteinCals = proteinGrams * 4;
  const carbsCals = carbsGrams * 4;
  const fatCals = fatGrams * 9;
  const totalCalculated = Math.max(proteinCals + carbsCals + fatCals, 1);

  const proteinPct = Math.round((proteinCals / totalCalculated) * 100);
  const carbsPct = Math.round((carbsCals / totalCalculated) * 100);
  const fatPct = Math.round((fatCals / totalCalculated) * 100);

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Objetivo Calórico Diario
        </span>
        <span className="text-lg font-extrabold text-slate-900">
          {calories} <span className="text-xs font-normal text-slate-500">kcal</span>
        </span>
      </div>

      {/* Progress bar split */}
      <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex mb-3">
        <div 
          style={{ width: `${proteinPct}%` }} 
          className="bg-emerald-500 transition-all duration-500" 
          title={`Proteínas: ${proteinGrams}g (${proteinPct}%)`}
        />
        <div 
          style={{ width: `${carbsPct}%` }} 
          className="bg-amber-500 transition-all duration-500" 
          title={`Carbohidratos: ${carbsGrams}g (${carbsPct}%)`}
        />
        <div 
          style={{ width: `${fatPct}%` }} 
          className="bg-rose-500 transition-all duration-500" 
          title={`Grasas: ${fatGrams}g (${fatPct}%)`}
        />
      </div>

      {/* Breakdown chips */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
          <p className="text-[11px] font-semibold text-emerald-800">Proteína ({proteinPct}%)</p>
          <p className="text-sm font-bold text-emerald-900">{proteinGrams}g</p>
          <p className="text-[10px] text-emerald-600">{proteinCals} kcal</p>
        </div>
        <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
          <p className="text-[11px] font-semibold text-amber-800">Carbos ({carbsPct}%)</p>
          <p className="text-sm font-bold text-amber-900">{carbsGrams}g</p>
          <p className="text-[10px] text-amber-600">{carbsCals} kcal</p>
        </div>
        <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100">
          <p className="text-[11px] font-semibold text-rose-800">Grasas ({fatPct}%)</p>
          <p className="text-sm font-bold text-rose-900">{fatGrams}g</p>
          <p className="text-[10px] text-rose-600">{fatCals} kcal</p>
        </div>
      </div>
    </div>
  );
};
