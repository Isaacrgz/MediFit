import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { MedicalIndication, DietPlan, RoutinePlan, PatientProgress } from '../../types';
import { CategoryBadge } from '../../components/CategoryBadge';
import { MacroBar } from '../../components/MacroBar';
import { 
  CheckCircle2, 
  Circle, 
  Pill, 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Clock, 
  Timer, 
  Heart, 
  AlertCircle,
  Plus,
  Flame,
  Award
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { currentPatient, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'today' | 'indications' | 'diet' | 'routine' | 'progress'>('today');

  const [indications, setIndications] = useState<MedicalIndication[]>([]);
  const [diet, setDiet] = useState<DietPlan | null>(null);
  const [routine, setRoutine] = useState<RoutinePlan | null>(null);
  const [progressHistory, setProgressHistory] = useState<PatientProgress[]>([]);

  // Interactive daily checklist state
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({
    'ind-1': true,
    'ind-2': false,
    'meal-1': true,
    'meal-2': true,
    'routine-ex-1': true
  });

  // Rest timer helper for routine
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // New progress log form
  const [newLog, setNewLog] = useState({
    weight: currentPatient?.currentWeight || 68.5,
    energyLevel: 5 as 1 | 2 | 3 | 4 | 5,
    notes: '',
  });

  useEffect(() => {
    if (!currentPatient) return;

    const loadData = async () => {
      const [inds, dietsList, routinesList, prog] = await Promise.all([
        dataService.getIndications(currentPatient.id),
        dataService.getDiets(currentPatient.id),
        dataService.getRoutines(currentPatient.id),
        dataService.getProgress(currentPatient.id),
      ]);
      setIndications(inds);
      if (dietsList.length > 0) setDiet(dietsList[0]);
      if (routinesList.length > 0) setRoutine(routinesList[0]);
      setProgressHistory(prog);
    };

    loadData();
  }, [currentPatient]);

  // Timer countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const toggleCheckItem = (key: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;

    const entry = await dataService.addProgress({
      patientId: currentPatient.id,
      date: new Date().toISOString().split('T')[0],
      weight: Number(newLog.weight),
      energyLevel: newLog.energyLevel,
      adherenceRate: 95,
      notes: newLog.notes || 'Registro diario del paciente',
    });

    const updated = await dataService.getProgress(currentPatient.id);
    setProgressHistory(updated);
    setNewLog({ ...newLog, notes: '' });
  };

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const totalTasks = indications.length + (diet?.meals.length || 0);
  const completionPercentage = Math.round((completedCount / Math.max(totalTasks, 1)) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Patient Welcome Hero */}
      <div className="bg-gradient-to-r from-medical-600 via-medical-700 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-medical-600/20 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Portal del Paciente Activo</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ¡Hola, {currentPatient?.fullName || user?.fullName}!
            </h1>
            <p className="text-white/80 text-sm mt-1.5 max-w-xl">
              Aquí tienes tus indicaciones médicas, dieta y rutinas asignadas por tu médico para alcanzar tus metas de salud.
            </p>
          </div>

          {/* Quick Doctor Info badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[220px]">
            <span className="text-[11px] uppercase tracking-wider text-white/70 block">Médico a cargo</span>
            <p className="font-bold text-base text-white mt-0.5">Dr. Alejandro Valdez</p>
            <p className="text-xs text-white/80">Medicina Deportiva y Nutrición</p>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/90">
              <span>Última revisión:</span>
              <strong className="text-amber-200">28 Sep 2026</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 sm:gap-4 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('today')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
            activeTab === 'today'
              ? 'border-medical-600 text-medical-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Mi Día Hoy
        </button>
        <button
          onClick={() => setActiveTab('indications')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
            activeTab === 'indications'
              ? 'border-medical-600 text-medical-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pill className="w-4 h-4" />
          Indicaciones ({indications.length})
        </button>
        <button
          onClick={() => setActiveTab('diet')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
            activeTab === 'diet'
              ? 'border-medical-600 text-medical-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          Mi Dieta ({diet?.dailyCalories || 0} kcal)
        </button>
        <button
          onClick={() => setActiveTab('routine')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
            activeTab === 'routine'
              ? 'border-medical-600 text-medical-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          Mi Rutina
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
            activeTab === 'progress'
              ? 'border-medical-600 text-medical-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Mi Progreso
        </button>
      </div>

      {/* ===================== TAB 1: MI DÍA HOY ===================== */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          {/* Adherence and tasks progress card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Plan de Hábitos para Hoy
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Marca cada indicación y comida conforme las vayas cumpliendo.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Adherencia de hoy:</span>
                <span className="text-sm font-extrabold text-emerald-600 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  {completionPercentage}%
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-6">
              <div 
                className="bg-gradient-to-r from-medical-500 to-brand-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(completionPercentage, 100)}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Indicaciones Médicas y Medicación
              </h4>
              {indications.map((ind) => {
                const isChecked = !!completedItems[ind.id];
                return (
                  <div
                    key={ind.id}
                    onClick={() => toggleCheckItem(ind.id)}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                      isChecked
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button type="button" className="mt-0.5 text-medical-600 focus:outline-none">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {ind.title}
                        </span>
                        <CategoryBadge category={ind.category} size="sm" />
                      </div>
                      <p className={`text-xs ${isChecked ? 'text-slate-400' : 'text-slate-600'}`}>
                        {ind.description}
                      </p>
                      {ind.dosage && (
                        <span className="inline-block mt-1 text-[11px] font-semibold text-slate-500">
                          📌 Dosis: {ind.dosage} — {ind.frequency}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-4">
                Comidas del Plan Nutricional
              </h4>
              {diet?.meals.map((meal) => {
                const isChecked = !!completedItems[meal.id];
                return (
                  <div
                    key={meal.id}
                    onClick={() => toggleCheckItem(meal.id)}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition ${
                      isChecked
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button type="button" className="mt-0.5 text-medical-600 focus:outline-none">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-medical-700 bg-medical-50 px-2 py-0.5 rounded">
                          {meal.time}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{meal.calories} kcal</span>
                      </div>
                      <h5 className={`text-sm font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {meal.title}
                      </h5>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {meal.foods.join(' • ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: INDICACIONES MÉDICAS ===================== */}
      {activeTab === 'indications' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                Indicaciones Clínicas Oficiales
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Estas indicaciones fueron emitidas por tu médico tratante. No suspendas ningún tratamiento sin consultarlo previamente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indications.map((ind) => (
              <div key={ind.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <CategoryBadge category={ind.category} />
                  <span className="text-[11px] text-slate-400">
                    Vigente desde: {ind.startDate}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900">{ind.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{ind.description}</p>

                {(ind.dosage || ind.frequency) && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    {ind.dosage && (
                      <span className="font-semibold text-slate-700">
                        Dosis: <strong className="text-indigo-900">{ind.dosage}</strong>
                      </span>
                    )}
                    {ind.frequency && (
                      <span className="font-semibold text-slate-700">
                        Horario: <strong className="text-medical-900">{ind.frequency}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: MI DIETA ===================== */}
      {activeTab === 'diet' && (
        <div className="space-y-6">
          {diet ? (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{diet.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{diet.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 self-start sm:self-auto">
                    {diet.dailyCalories} kcal / día
                  </span>
                </div>

                <MacroBar
                  calories={diet.dailyCalories}
                  proteinGrams={diet.macros.protein}
                  carbsGrams={diet.macros.carbs}
                  fatGrams={diet.macros.fats}
                />
              </div>

              {/* Meals schedule cards */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800">
                  Horarios y Comidas Asignadas
                </h4>
                {diet.meals.map((meal, index) => (
                  <div key={meal.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-medical-50 text-medical-700 font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-medical-100 text-medical-800">
                          {meal.time}
                        </span>
                        <h5 className="text-sm font-extrabold text-slate-900">{meal.title}</h5>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{meal.calories} kcal</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Ingredientes recomendados:
                      </p>
                      <ul className="space-y-1.5 pl-2 text-xs text-slate-700">
                        {meal.foods.map((food, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="text-medical-500 font-bold">•</span>
                            <span>{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {meal.recommendations && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-xs text-brand-900 bg-brand-50/70 p-2.5 rounded-xl border border-brand-100">
                        💡 <strong>Nota del Doctor:</strong> {meal.recommendations}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No tienes una dieta asignada en este momento</p>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 4: MI RUTINA ===================== */}
      {activeTab === 'routine' && (
        <div className="space-y-6">
          {routine ? (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      Nivel {routine.level}
                    </span>
                    <span className="text-xs text-slate-500">{routine.frequencyDaysPerWeek} días / semana</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">{routine.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">{routine.description}</p>
                  <p className="text-xs font-semibold text-medical-700 mt-1">🎯 Objetivo: {routine.targetGoal}</p>
                </div>

                {/* Rest timer widget */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center min-w-[200px]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                    <Timer className="w-4 h-4 text-indigo-600" />
                    <span>Temporizador de Descanso</span>
                  </div>
                  <div className="text-3xl font-black text-indigo-600 my-1 font-mono">
                    {timerSeconds !== null ? `${timerSeconds}s` : '--'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      onClick={() => startRestTimer(45)}
                      className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      45s
                    </button>
                    <button
                      onClick={() => startRestTimer(60)}
                      className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      60s
                    </button>
                    <button
                      onClick={() => startRestTimer(90)}
                      className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      90s
                    </button>
                  </div>
                </div>
              </div>

              {/* Exercises List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routine.exercises.map((ex) => (
                  <div key={ex.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-medical-700 bg-medical-50 px-2 py-0.5 rounded">
                        {ex.day}
                      </span>
                      <span className="text-xs text-slate-400">{ex.muscleGroup}</span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900">{ex.name}</h4>

                    <div className="grid grid-cols-3 gap-2 py-2 bg-slate-50 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Series</span>
                        <strong className="text-slate-800 font-bold">{ex.sets}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Repeticiones</span>
                        <strong className="text-slate-800 font-bold">{ex.reps}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Descanso</span>
                        <strong className="text-indigo-600 font-bold">{ex.restSeconds}s</strong>
                      </div>
                    </div>

                    {ex.instructions && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                        {ex.instructions}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => startRestTimer(ex.restSeconds)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <Timer className="w-3.5 h-3.5" />
                        Iniciar descanso ({ex.restSeconds}s)
                      </button>

                      {ex.videoUrl && (
                        <a
                          href={ex.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-medical-600 hover:underline"
                        >
                          Ver video demostrativo →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Dumbbell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No tienes rutinas asignadas actualmente</p>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 5: MI PROGRESO ===================== */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Record progress form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Registrar Avance de Hoy
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Comparte con tu médico tu pesaje actual y cómo te sentiste con tu energía.
            </p>

            <form onSubmit={handleLogProgress} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Peso actual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newLog.weight}
                  onChange={(e) => setNewLog({ ...newLog, weight: Number(e.target.value) })}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nivel de Energía (1 a 5)
                </label>
                <select
                  value={newLog.energyLevel}
                  onChange={(e) => setNewLog({ ...newLog, energyLevel: Number(e.target.value) as any })}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Excelente energía</option>
                  <option value={4}>⭐⭐⭐⭐ Buena energía</option>
                  <option value={3}>⭐⭐⭐ Regular / Normal</option>
                  <option value={2}>⭐⭐ Con fatiga leve</option>
                  <option value={1}>⭐ Muy agotado / Malestar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas para el doctor
                </label>
                <input
                  type="text"
                  placeholder="Ej: Buena digestión, rutina completada..."
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs shadow-md shadow-medical-500/20 transition"
                >
                  Guardar Registro de Progreso
                </button>
              </div>
            </form>
          </div>

          {/* Evolution history */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800">
              Historial de Evolución
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {progressHistory.map((item, idx) => (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{item.date}</span>
                    <span className="font-bold text-medical-600">Registro #{idx + 1}</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    {item.weight} <span className="text-xs font-normal text-slate-500">kg</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Energía: {'⭐'.repeat(item.energyLevel || 4)}
                  </p>
                  {item.notes && (
                    <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
