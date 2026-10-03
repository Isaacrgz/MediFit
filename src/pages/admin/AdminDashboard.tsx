import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, mockPatients, mockIndications, mockDiets } from '../../data/mockData';
import { 
  ShieldCheck, 
  Users, 
  Stethoscope, 
  Activity, 
  Database, 
  FileCode, 
  CheckCircle2, 
  ExternalLink,
  Settings,
  HeartHandshake
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isLiveSupabase } = useAuth();

  const doctors = mockUsers.filter(u => u.role === 'doctor');
  const patientsCount = mockPatients.length;
  const indicationsCount = mockIndications.length;
  const dietsCount = mockDiets.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panel de Control Global
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Administración del Sistema MedFit
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitoreo de médicos, pacientes activos, prescripciones y estado de infraestructura.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Médicos Registrados
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{doctors.length}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% operativos</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pacientes en Tratamiento
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{patientsCount}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">+12% este mes</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Indicaciones Emitidas
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{indicationsCount}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">Tratamientos activos</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Planes Nutricionales
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{dietsCount}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">94% Adherencia promedio</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Doctors Directory */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Cuerpo Médico y Especialistas
            </h3>
            <span className="text-xs font-semibold text-purple-600">
              {doctors.length} Especialistas
            </span>
          </div>

          <div className="space-y-3">
            {doctors.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{doc.fullName}</h4>
                    <p className="text-xs text-purple-700 font-medium">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doc.email} • {doc.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Activo
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">3 Pacientes asignados</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supabase & Deployment Infrastructure Guide */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-medical-600" />
              <h3 className="text-base font-bold text-slate-900">
                Infraestructura Supabase
              </h3>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isLiveSupabase 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isLiveSupabase ? 'Conectado a la nube' : 'Modo Mock Demo'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <p>
              La plataforma está lista para sincronizar con tu base de datos PostgreSQL en Supabase.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-medical-600" />
                Script de Inicialización
              </h5>
              <p className="text-slate-500">
                El archivo <code className="text-indigo-600 font-mono">supabase/schema.sql</code> contiene todas las tablas, triggers de autenticación y políticas RLS.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="font-bold text-slate-800">Pasos para conectar:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                <li>Crear un proyecto gratuito en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-medical-600 underline">supabase.com</a></li>
                <li>Copiar y ejecutar el contenido de <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">supabase/schema.sql</code> en el SQL Editor.</li>
                <li>Copiar <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">.env.example</code> a <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">.env.local</code> y colocar tu URL y Anon Key.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
