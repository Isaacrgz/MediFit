import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Activity, 
  UserCheck, 
  Stethoscope, 
  ShieldCheck, 
  LogOut, 
  Database, 
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { user, role, logout, switchUserRole, isLiveSupabase } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (r: UserRole | null) => {
    switch (r) {
      case 'doctor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Stethoscope className="w-3 h-3 text-emerald-600" />
            Médico / Nutriólogo
          </span>
        );
      case 'patient':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <UserCheck className="w-3 h-3 text-sky-600" />
            Paciente
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3 h-3 text-purple-600" />
            Administrador
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-medical-700 to-brand-700 bg-clip-text text-transparent">
                  MedFit
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
                  Clinical
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Indicaciones Clínicas, Dietas y Rutinas
              </p>
            </div>
          </div>

          {/* Quick Role Switcher & Database Status */}
          <div className="flex items-center gap-3">
            {/* Supabase status badge */}
            <div 
              title={isLiveSupabase ? "Conectado a Supabase en vivo" : "Modo demostración con datos locales integrados (configura .env para Supabase)"}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isLiveSupabase 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isLiveSupabase ? 'Supabase Activo' : 'Demo Local Activo'}</span>
            </div>

            {/* Role switcher dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white shadow-sm text-sm font-medium text-slate-700 transition"
              >
                <span className="text-xs text-slate-400">Rol:</span>
                {getRoleBadge(role)}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowRoleMenu(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Cambiar rol para simulación
                  </div>
                  <button
                    onClick={() => { switchUserRole('doctor'); setShowRoleMenu(false); onTabChange('patients'); }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-50 transition ${role === 'doctor' ? 'font-semibold text-emerald-700 bg-emerald-50/50' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-600" />
                      <span>Dr. Alejandro Valdez</span>
                    </div>
                    <span className="text-xs text-slate-400">Médico</span>
                  </button>
                  <button
                    onClick={() => { switchUserRole('patient'); setShowRoleMenu(false); onTabChange('daily'); }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-50 transition ${role === 'patient' ? 'font-semibold text-sky-700 bg-sky-50/50' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-sky-600" />
                      <span>Sofía Martínez</span>
                    </div>
                    <span className="text-xs text-slate-400">Paciente</span>
                  </button>
                  <button
                    onClick={() => { switchUserRole('admin'); setShowRoleMenu(false); onTabChange('admin'); }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-50 transition ${role === 'admin' ? 'font-semibold text-purple-700 bg-purple-50/50' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <span>Dra. Elena Ramos</span>
                    </div>
                    <span className="text-xs text-slate-400">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile summary & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.fullName} 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-medical-500/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{user?.email}</p>
              </div>

              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
