import React, { useState, useEffect } from 'react';
import { Patient, MedicalIndication, DietPlan, RoutinePlan, PatientProgress, IndicationCategory } from '../../types';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { CategoryBadge } from '../../components/CategoryBadge';
import { MacroBar } from '../../components/MacroBar';
import { Modal } from '../../components/Modal';
import { 
  Users, 
  Search, 
  Plus, 
  Pill, 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  Scale, 
  CheckCircle2, 
  XCircle,
  FileText,
  Activity,
  Heart
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'indications' | 'diets' | 'routines' | 'progress'>('indications');

  // Medical data for selected patient
  const [indications, setIndications] = useState<MedicalIndication[]>([]);
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [routines, setRoutines] = useState<RoutinePlan[]>([]);
  const [progress, setProgress] = useState<PatientProgress[]>([]);

  // Modals state
  const [isIndicationModalOpen, setIsIndicationModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Form states
  const [newIndication, setNewIndication] = useState({
    title: '',
    description: '',
    category: 'medication' as IndicationCategory,
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const [newDiet, setNewDiet] = useState({
    name: '',
    description: '',
    dailyCalories: 1800,
    protein: 140,
    carbs: 180,
    fats: 50,
    mealTitle: 'Desayuno',
    mealTime: '08:00 AM',
    mealFoods: 'Huevos revueltos con avena y manzana',
    mealCals: 400
  });

  const [newRoutine, setNewRoutine] = useState({
    name: '',
    description: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    frequencyDaysPerWeek: 3,
    targetGoal: '',
    exerciseName: 'Sentadillas',
    exerciseDay: 'Día 1: Pierna',
    exerciseSets: 3,
    exerciseReps: '12 reps',
    exerciseRest: 60
  });

  const [newPatientData, setNewPatientData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '1995-01-01',
    gender: 'female' as 'male' | 'female' | 'other',
    bloodType: 'O+',
    allergies: '',
    medicalHistory: '',
    currentWeight: 70,
    targetWeight: 65,
    height: 165
  });

  // Load patients on mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const data = await dataService.getPatients();
    setPatients(data);
    if (data.length > 0 && !selectedPatient) {
      setSelectedPatient(data[0]);
    }
  };

  // Load patient clinical details when selected
  useEffect(() => {
    if (!selectedPatient) return;

    const loadPatientDetails = async () => {
      const [inds, dts, routs, progs] = await Promise.all([
        dataService.getIndications(selectedPatient.id),
        dataService.getDiets(selectedPatient.id),
        dataService.getRoutines(selectedPatient.id),
        dataService.getProgress(selectedPatient.id),
      ]);
      setIndications(inds);
      setDiets(dts);
      setRoutines(routs);
      setProgress(progs);
    };

    loadPatientDetails();
  }, [selectedPatient]);

  const handleCreateIndication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !user) return;

    await dataService.createIndication({
      patientId: selectedPatient.id,
      doctorId: user.id,
      title: newIndication.title,
      description: newIndication.description,
      category: newIndication.category,
      dosage: newIndication.dosage,
      frequency: newIndication.frequency,
      startDate: newIndication.startDate,
      isActive: true,
    });

    const updated = await dataService.getIndications(selectedPatient.id);
    setIndications(updated);
    setIsIndicationModalOpen(false);
    setNewIndication({
      title: '',
      description: '',
      category: 'medication',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleToggleIndication = async (id: string) => {
    await dataService.toggleIndicationStatus(id);
    if (selectedPatient) {
      const updated = await dataService.getIndications(selectedPatient.id);
      setIndications(updated);
    }
  };

  const handleCreateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !user) return;

    await dataService.createDiet({
      patientId: selectedPatient.id,
      doctorId: user.id,
      name: newDiet.name,
      description: newDiet.description,
      dailyCalories: Number(newDiet.dailyCalories),
      macros: {
        protein: Number(newDiet.protein),
        carbs: Number(newDiet.carbs),
        fats: Number(newDiet.fats),
      },
      status: 'active',
      meals: [
        {
          id: `m-${Date.now()}`,
          time: newDiet.mealTime,
          title: newDiet.mealTitle,
          foods: newDiet.mealFoods.split(',').map(s => s.trim()),
          calories: Number(newDiet.mealCals),
          proteinGrams: Math.round(Number(newDiet.protein) * 0.3),
          carbsGrams: Math.round(Number(newDiet.carbs) * 0.3),
          fatGrams: Math.round(Number(newDiet.fats) * 0.3),
        }
      ]
    });

    const updated = await dataService.getDiets(selectedPatient.id);
    setDiets(updated);
    setIsDietModalOpen(false);
  };

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !user) return;

    await dataService.createRoutine({
      patientId: selectedPatient.id,
      doctorId: user.id,
      name: newRoutine.name,
      description: newRoutine.description,
      level: newRoutine.level,
      frequencyDaysPerWeek: Number(newRoutine.frequencyDaysPerWeek),
      targetGoal: newRoutine.targetGoal,
      status: 'active',
      exercises: [
        {
          id: `ex-${Date.now()}`,
          name: newRoutine.exerciseName,
          day: newRoutine.exerciseDay,
          muscleGroup: 'General',
          sets: Number(newRoutine.exerciseSets),
          reps: newRoutine.exerciseReps,
          restSeconds: Number(newRoutine.exerciseRest),
        }
      ]
    });

    const updated = await dataService.getRoutines(selectedPatient.id);
    setRoutines(updated);
    setIsRoutineModalOpen(false);
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const created = await dataService.createPatient({
      userId: `user-${Date.now()}`,
      doctorId: user.id,
      fullName: newPatientData.fullName,
      email: newPatientData.email,
      phone: newPatientData.phone,
      birthDate: newPatientData.birthDate,
      gender: newPatientData.gender,
      bloodType: newPatientData.bloodType,
      allergies: newPatientData.allergies ? newPatientData.allergies.split(',').map(s => s.trim()) : [],
      medicalHistory: newPatientData.medicalHistory,
      currentWeight: Number(newPatientData.currentWeight),
      targetWeight: Number(newPatientData.targetWeight),
      height: Number(newPatientData.height),
      status: 'active',
    });

    await loadPatients();
    setSelectedPatient(created);
    setIsPatientModalOpen(false);
  };

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateBMI = (weight: number, heightCm: number) => {
    if (!weight || !heightCm) return null;
    const heightM = heightCm / 100;
    return (weight / (heightM * heightM)).toFixed(1);
  };

  const calculateAge = (birthDate: string) => {
    const diff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Consultorio Clínico y Prescripción
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Asigna indicaciones médicas, programas de nutrición y planes de entrenamiento personalizados.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPatientModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-medical-600 to-brand-600 text-white font-semibold text-sm shadow-md shadow-medical-500/25 hover:from-medical-700 hover:to-brand-700 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Nuevo Paciente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Patient Directory list */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-medical-600" />
              <h2 className="text-base font-bold text-slate-800">Directorio de Pacientes</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {patients.length} pacientes
            </span>
          </div>

          {/* Search box */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500 transition"
            />
          </div>

          {/* Patient list items */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredPatients.map((pat) => {
              const isSelected = selectedPatient?.id === pat.id;
              const bmi = calculateBMI(pat.currentWeight, pat.height);

              return (
                <div
                  key={pat.id}
                  onClick={() => setSelectedPatient(pat)}
                  className={`p-3.5 rounded-xl cursor-pointer transition border text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-medical-50/80 to-brand-50/80 border-medical-300 shadow-sm'
                      : 'hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-medical-900' : 'text-slate-800'}`}>
                        {pat.fullName}
                      </h4>
                      <p className="text-xs text-slate-500">{pat.email}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      pat.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {pat.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3 h-3 text-slate-400" />
                      {pat.currentWeight} kg <span className="text-slate-300">|</span> IMC {bmi}
                    </span>
                    <span>Meta: <strong className="text-slate-700">{pat.targetWeight} kg</strong></span>
                  </div>
                </div>
              );
            })}

            {filteredPatients.length === 0 && (
              <p className="text-center py-8 text-xs text-slate-400">
                No se encontraron pacientes que coincidan con la búsqueda.
              </p>
            )}
          </div>
        </div>

        {/* Right column: Patient Clinical Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient header card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-medical-500 to-brand-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-medical-500/20">
                      {selectedPatient.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {selectedPatient.fullName}
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                          {calculateAge(selectedPatient.birthDate)} años
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {selectedPatient.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {selectedPatient.phone}
                        </span>
                        <span>Tipo: <strong className="text-slate-700">{selectedPatient.bloodType || 'N/A'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span className="text-xs text-slate-400">Índice Masa Corporal</span>
                    <span className="text-2xl font-black text-medical-600">
                      {calculateBMI(selectedPatient.currentWeight, selectedPatient.height)}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Estatura: {selectedPatient.height} cm
                    </span>
                  </div>
                </div>

                {/* Clinical alerts & History */}
                <div className="mt-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Allergies Alert */}
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-900">Alergias y Contraindicaciones</h4>
                      <p className="text-xs text-rose-700 mt-0.5">
                        {selectedPatient.allergies && selectedPatient.allergies.length > 0
                          ? selectedPatient.allergies.join(', ')
                          : 'Sin alergias conocidas registradas.'}
                      </p>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Antecedentes Clínicos</h4>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {selectedPatient.medicalHistory || 'Sin antecedentes patológicos reportados.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar towards target weight */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-600">
                      Peso actual: <strong className="text-slate-900">{selectedPatient.currentWeight} kg</strong>
                    </span>
                    <span className="text-slate-600">
                      Meta clínica: <strong className="text-emerald-700">{selectedPatient.targetWeight} kg</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-medical-500 to-brand-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min(
                          Math.max(
                            ((selectedPatient.currentWeight - selectedPatient.targetWeight) / selectedPatient.currentWeight) * 100, 
                            15
                          ), 
                          100
                        )}%` 
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Tabs for patient's care plan */}
              <div className="flex border-b border-slate-200 gap-2">
                <button
                  onClick={() => setActiveTab('indications')}
                  className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                    activeTab === 'indications'
                      ? 'border-medical-600 text-medical-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Pill className="w-4 h-4" />
                  Indicaciones Médicas ({indications.length})
                </button>
                <button
                  onClick={() => setActiveTab('diets')}
                  className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                    activeTab === 'diets'
                      ? 'border-medical-600 text-medical-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  Planes de Dieta ({diets.length})
                </button>
                <button
                  onClick={() => setActiveTab('routines')}
                  className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                    activeTab === 'routines'
                      ? 'border-medical-600 text-medical-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Dumbbell className="w-4 h-4" />
                  Rutinas de Ejercicio ({routines.length})
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                    activeTab === 'progress'
                      ? 'border-medical-600 text-medical-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Seguimiento ({progress.length})
                </button>
              </div>

              {/* TAB CONTENT: 1. INDICACIONES MÉDICAS */}
              {activeTab === 'indications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Indicaciones y Prescripciones Clínicas
                      </h3>
                      <p className="text-xs text-slate-500">
                        Pautas terapéuticas, medicamentos, posologías y advertencias compartidas con el paciente.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsIndicationModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-medical-50 text-medical-700 border border-medical-200 text-xs font-bold hover:bg-medical-100 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      Prescribir Indicación
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {indications.map((ind) => (
                      <div
                        key={ind.id}
                        className={`p-5 rounded-2xl border transition ${
                          ind.isActive
                            ? 'bg-white border-slate-200 shadow-sm hover:border-medical-200'
                            : 'bg-slate-50/60 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2.5 mb-2">
                              <CategoryBadge category={ind.category} />
                              <span className="text-xs text-slate-400">
                                Desde: {ind.startDate}
                              </span>
                              {!ind.isActive && (
                                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                                  Inactiva
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-extrabold text-slate-900 mb-1">
                              {ind.title}
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {ind.description}
                            </p>

                            {(ind.dosage || ind.frequency) && (
                              <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                {ind.dosage && (
                                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                                    <Pill className="w-3.5 h-3.5 text-indigo-500" />
                                    Dosis: <span className="text-indigo-900 font-bold">{ind.dosage}</span>
                                  </span>
                                )}
                                {ind.frequency && (
                                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                                    <Clock className="w-3.5 h-3.5 text-medical-500" />
                                    Frecuencia: <span className="text-medical-900 font-bold">{ind.frequency}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleToggleIndication(ind.id)}
                            title={ind.isActive ? "Marcar como inactiva" : "Reactivar indicación"}
                            className={`p-2 rounded-xl transition ${
                              ind.isActive
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {ind.isActive ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}

                    {indications.length === 0 && (
                      <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                        <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-600">No hay indicaciones médicas registradas</p>
                        <p className="text-xs text-slate-400 mt-1">Prescribe el primer tratamiento o recomendación para este paciente.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: 2. DIETAS */}
              {activeTab === 'diets' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Planes Nutricionales Asignados
                      </h3>
                      <p className="text-xs text-slate-500">
                        Estructura de macronutrientes, calorías y menú desglosado por tiempos de comida.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsDietModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-medical-50 text-medical-700 border border-medical-200 text-xs font-bold hover:bg-medical-100 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      Crear Plan de Dieta
                    </button>
                  </div>

                  {diets.map((diet) => (
                    <div key={diet.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                              Plan Activo
                            </span>
                            <span className="text-xs text-slate-400">Creado: {diet.createdAt.split('T')[0]}</span>
                          </div>
                          <h4 className="text-lg font-extrabold text-slate-900">{diet.name}</h4>
                          {diet.description && (
                            <p className="text-xs text-slate-600 mt-1">{diet.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Macronutrient breakdown bar */}
                      <MacroBar
                        calories={diet.dailyCalories}
                        proteinGrams={diet.macros.protein}
                        carbsGrams={diet.macros.carbs}
                        fatGrams={diet.macros.fats}
                      />

                      {/* Meals timeline */}
                      <div className="space-y-3 pt-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Comidas Programadas ({diet.meals.length})
                        </h5>
                        <div className="space-y-3">
                          {diet.meals.map((meal) => (
                            <div key={meal.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-medical-100 text-medical-800">
                                    {meal.time}
                                  </span>
                                  <h6 className="text-sm font-bold text-slate-900">{meal.title}</h6>
                                </div>
                                <span className="text-xs font-bold text-slate-600">{meal.calories} kcal</span>
                              </div>

                              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-1">
                                {meal.foods.map((food, i) => (
                                  <li key={i}>{food}</li>
                                ))}
                              </ul>

                              {meal.recommendations && (
                                <p className="mt-2.5 text-[11px] text-brand-800 bg-brand-50/80 p-2 rounded-lg border border-brand-100">
                                  💡 <strong>Nota del Doctor:</strong> {meal.recommendations}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {diets.length === 0 && (
                    <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                      <Utensils className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600">No hay planes de nutrición asignados</p>
                      <p className="text-xs text-slate-400 mt-1">Configura las comidas y requerimientos calóricos para este paciente.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: 3. RUTINAS */}
              {activeTab === 'routines' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Planes de Entrenamiento Físico
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ejercicios prescritos, volumen semanal, series, repeticiones y tiempo de recuperación.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsRoutineModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-medical-50 text-medical-700 border border-medical-200 text-xs font-bold hover:bg-medical-100 transition shadow-sm"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      Crear Rutina
                    </button>
                  </div>

                  {routines.map((routine) => (
                    <div key={routine.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                              Nivel {routine.level}
                            </span>
                            <span className="text-xs text-slate-500">
                              {routine.frequencyDaysPerWeek} días por semana
                            </span>
                          </div>
                          <h4 className="text-lg font-extrabold text-slate-900">{routine.name}</h4>
                          <p className="text-xs text-slate-600 mt-1">{routine.description}</p>
                          <p className="text-xs font-semibold text-medical-700 mt-1.5">
                            🎯 Objetivo: {routine.targetGoal}
                          </p>
                        </div>
                      </div>

                      {/* Exercises grid */}
                      <div className="space-y-3">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Ejercicios Configurados ({routine.exercises.length})
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {routine.exercises.map((ex) => (
                            <div key={ex.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-medical-700 bg-medical-100/70 px-2 py-0.5 rounded">
                                {ex.day}
                              </span>
                              <h6 className="text-sm font-bold text-slate-900 mt-2">{ex.name}</h6>
                              <p className="text-xs text-slate-500 mb-3">Grupo: {ex.muscleGroup}</p>

                              <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-200/60 text-center text-xs">
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Series</span>
                                  <strong className="text-slate-800">{ex.sets}</strong>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Reps</span>
                                  <strong className="text-slate-800">{ex.reps}</strong>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 block">Descanso</span>
                                  <strong className="text-slate-800">{ex.restSeconds}s</strong>
                                </div>
                              </div>

                              {ex.instructions && (
                                <p className="text-[11px] text-slate-600 mt-2.5">
                                  {ex.instructions}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {routines.length === 0 && (
                    <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                      <Dumbbell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600">No hay rutinas asignadas</p>
                      <p className="text-xs text-slate-400 mt-1">Crea un plan de acondicionamiento físico adaptado a las condiciones de salud del paciente.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: 4. SEGUIMIENTO Y AVANCES */}
              {activeTab === 'progress' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Historial Clínico y Evolución Biométrica
                    </h3>
                    <p className="text-xs text-slate-500">
                      Registros de peso, grasa corporal, circunferencia y notas de adherencia.
                    </p>
                  </div>

                  {/* Visual weight chart cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {progress.map((item, idx) => (
                      <div key={item.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>{item.date}</span>
                          <span className="text-medical-600 font-bold">Sesión #{idx + 1}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                          {item.weight} <span className="text-xs font-normal text-slate-500">kg</span>
                        </p>
                        {item.bodyFatPercentage && (
                          <p className="text-xs text-slate-600 mt-1">
                            Grasa: <strong>{item.bodyFatPercentage}%</strong>
                          </p>
                        )}
                        {item.adherenceRate && (
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400">Adherencia:</span>
                            <span className="font-bold text-emerald-600">{item.adherenceRate}%</span>
                          </div>
                        )}
                        {item.notes && (
                          <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Selecciona un paciente</h3>
              <p className="text-xs text-slate-400 mt-1">Haz clic en la lista lateral para cargar su expediente clínico y planes.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: NUEVA INDICACIÓN */}
      <Modal
        isOpen={isIndicationModalOpen}
        onClose={() => setIsIndicationModalOpen(false)}
        title="Prescribir Nueva Indicación Médica"
        subtitle={`Para el paciente: ${selectedPatient?.fullName}`}
      >
        <form onSubmit={handleCreateIndication} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Categoría de la Indicación
            </label>
            <select
              value={newIndication.category}
              onChange={(e) => setNewIndication({ ...newIndication, category: e.target.value as IndicationCategory })}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500"
            >
              <option value="medication">Medicamento (Fármaco / Posología)</option>
              <option value="hydration">Hidratación (Electrolitos / Consumo de agua)</option>
              <option value="lifestyle">Estilo de Vida (Sueño, manejo de estrés)</option>
              <option value="warning">Precaución / Alerta (Alimentos o acciones prohibidas)</option>
              <option value="general">Recomendación General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Título o Nombre de la Indicación
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Metformina 500mg con Alimentos"
              value={newIndication.title}
              onChange={(e) => setNewIndication({ ...newIndication, title: e.target.value })}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dosis (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: 500 mg / 1 cápsula"
                value={newIndication.dosage}
                onChange={(e) => setNewIndication({ ...newIndication, dosage: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Frecuencia / Horario
              </label>
              <input
                type="text"
                placeholder="Ej: Cada 24 horas (Cena)"
                value={newIndication.frequency}
                onChange={(e) => setNewIndication({ ...newIndication, frequency: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instrucciones Detalladas para el Paciente
            </label>
            <textarea
              required
              rows={3}
              placeholder="Instrucciones claras de cómo ingerir, qué alimentos evitar o precauciones clínicas..."
              value={newIndication.description}
              onChange={(e) => setNewIndication({ ...newIndication, description: e.target.value })}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsIndicationModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-medical-600 text-white hover:bg-medical-700 shadow-md shadow-medical-500/20"
            >
              Guardar y Notificar al Paciente
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: NUEVA DIETA */}
      <Modal
        isOpen={isDietModalOpen}
        onClose={() => setIsDietModalOpen(false)}
        title="Crear Plan de Alimentación y Nutrición"
        subtitle={`Para el paciente: ${selectedPatient?.fullName}`}
      >
        <form onSubmit={handleCreateDiet} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Plan</label>
            <input
              type="text"
              required
              placeholder="Ej: Plan Antiinflamatorio y Déficit Calórico"
              value={newDiet.name}
              onChange={(e) => setNewDiet({ ...newDiet, name: e.target.value })}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Calorías Totales</label>
              <input
                type="number"
                value={newDiet.dailyCalories}
                onChange={(e) => setNewDiet({ ...newDiet, dailyCalories: Number(e.target.value) })}
                className="w-full text-sm rounded-xl border border-slate-200 px-2 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-emerald-700 mb-1">Proteína (g)</label>
              <input
                type="number"
                value={newDiet.protein}
                onChange={(e) => setNewDiet({ ...newDiet, protein: Number(e.target.value) })}
                className="w-full text-sm rounded-xl border border-slate-200 px-2 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-amber-700 mb-1">Carbos (g)</label>
              <input
                type="number"
                value={newDiet.carbs}
                onChange={(e) => setNewDiet({ ...newDiet, carbs: Number(e.target.value) })}
                className="w-full text-sm rounded-xl border border-slate-200 px-2 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-rose-700 mb-1">Grasas (g)</label>
              <input
                type="number"
                value={newDiet.fats}
                onChange={(e) => setNewDiet({ ...newDiet, fats: Number(e.target.value) })}
                className="w-full text-sm rounded-xl border border-slate-200 px-2 py-1.5"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h5 className="text-xs font-bold text-slate-700">Primera comida configurada</h5>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Título: Ej: Desayuno"
                value={newDiet.mealTitle}
                onChange={(e) => setNewDiet({ ...newDiet, mealTitle: e.target.value })}
                className="text-xs rounded-lg border border-slate-200 px-2 py-1.5"
              />
              <input
                type="text"
                placeholder="Horario: Ej: 08:30 AM"
                value={newDiet.mealTime}
                onChange={(e) => setNewDiet({ ...newDiet, mealTime: e.target.value })}
                className="text-xs rounded-lg border border-slate-200 px-2 py-1.5"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Alimentos (separados por coma)..."
              value={newDiet.mealFoods}
              onChange={(e) => setNewDiet({ ...newDiet, mealFoods: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 px-2 py-1.5"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDietModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20"
            >
              Asignar Plan Nutricional
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: NUEVA RUTINA */}
      <Modal
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
        title="Crear Rutina de Entrenamiento"
        subtitle={`Para el paciente: ${selectedPatient?.fullName}`}
      >
        <form onSubmit={handleCreateRoutine} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Rutina</label>
            <input
              type="text"
              required
              placeholder="Ej: Acondicionamiento Metabólico y Fuerza"
              value={newRoutine.name}
              onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nivel</label>
              <select
                value={newRoutine.level}
                onChange={(e) => setNewRoutine({ ...newRoutine, level: e.target.value as any })}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
              >
                <option value="beginner">Principiante (Bajo impacto)</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado (Alto volumen)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Frecuencia semanal</label>
              <input
                type="number"
                min={1}
                max={7}
                value={newRoutine.frequencyDaysPerWeek}
                onChange={(e) => setNewRoutine({ ...newRoutine, frequencyDaysPerWeek: Number(e.target.value) })}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Objetivo del Programa</label>
            <input
              type="text"
              required
              placeholder="Ej: Mejora de sensibilidad a la insulina y postura"
              value={newRoutine.targetGoal}
              onChange={(e) => setNewRoutine({ ...newRoutine, targetGoal: e.target.value })}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h5 className="text-xs font-bold text-slate-700">Primer Ejercicio</h5>
            <input
              type="text"
              placeholder="Nombre del ejercicio (Ej: Sentadilla con mancuerna)"
              value={newRoutine.exerciseName}
              onChange={(e) => setNewRoutine({ ...newRoutine, exerciseName: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-200 px-2 py-1.5"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Series"
                value={newRoutine.exerciseSets}
                onChange={(e) => setNewRoutine({ ...newRoutine, exerciseSets: Number(e.target.value) })}
                className="text-xs rounded-lg border border-slate-200 px-2 py-1.5"
              />
              <input
                type="text"
                placeholder="Repeticiones"
                value={newRoutine.exerciseReps}
                onChange={(e) => setNewRoutine({ ...newRoutine, exerciseReps: e.target.value })}
                className="text-xs rounded-lg border border-slate-200 px-2 py-1.5"
              />
              <input
                type="number"
                placeholder="Descanso (seg)"
                value={newRoutine.exerciseRest}
                onChange={(e) => setNewRoutine({ ...newRoutine, exerciseRest: Number(e.target.value) })}
                className="text-xs rounded-lg border border-slate-200 px-2 py-1.5"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRoutineModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
            >
              Asignar Rutina
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: NUEVO PACIENTE */}
      <Modal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        title="Registrar Nuevo Paciente"
        subtitle="Crea el expediente clínico y habilita el acceso a la plataforma"
      >
        <form onSubmit={handleCreatePatient} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              placeholder="Ej: Juan Pérez Morales"
              value={newPatientData.fullName}
              onChange={(e) => setNewPatientData({ ...newPatientData, fullName: e.target.value })}
              className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                placeholder="paciente@correo.com"
                value={newPatientData.email}
                onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
              <input
                type="tel"
                placeholder="+52 55 ..."
                value={newPatientData.phone}
                onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Peso Actual (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newPatientData.currentWeight}
                onChange={(e) => setNewPatientData({ ...newPatientData, currentWeight: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-200 px-2 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Meta Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newPatientData.targetWeight}
                onChange={(e) => setNewPatientData({ ...newPatientData, targetWeight: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-200 px-2 py-1.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Estatura (cm)</label>
              <input
                type="number"
                value={newPatientData.height}
                onChange={(e) => setNewPatientData({ ...newPatientData, height: Number(e.target.value) })}
                className="w-full text-xs rounded-xl border border-slate-200 px-2 py-1.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-800 mb-1">Alergias o Contraindicaciones (separadas por coma)</label>
            <input
              type="text"
              placeholder="Ej: Penicilina, AINEs, Mariscos..."
              value={newPatientData.allergies}
              onChange={(e) => setNewPatientData({ ...newPatientData, allergies: e.target.value })}
              className="w-full text-xs rounded-xl border border-rose-200 px-3 py-2 bg-rose-50/30"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPatientModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-medical-600 text-white hover:bg-medical-700 shadow-md shadow-medical-500/20"
            >
              Crear Expediente
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
