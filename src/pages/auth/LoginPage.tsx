import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Activity, Stethoscope, UserCheck, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, isLoading, switchUserRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelect, setRoleSelect] = useState<UserRole>('doctor');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const ok = await login(email, roleSelect);
      if (ok) {
        onSuccess();
      } else {
        setErrorMsg('Credenciales inválidas');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchUserRole(role);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-medical-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-medical-500/25 mb-4">
          <Activity className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          MedFit Portal
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Plataforma de Prescripción Médica, Nutrición y Entrenamiento
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200/80">
          {/* Quick Demo Access banner */}
          <div className="mb-6 pb-6 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3 text-center">
              Acceso Rápido de Prueba (Demo 1-Click)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('doctor')}
                className="flex flex-col items-center p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 transition"
              >
                <Stethoscope className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-xs font-bold">Médico</span>
                <span className="text-[10px] text-emerald-700">Dr. Valdez</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient')}
                className="flex flex-col items-center p-3 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/70 text-sky-900 transition"
              >
                <UserCheck className="w-5 h-5 text-sky-600 mb-1" />
                <span className="text-xs font-bold">Paciente</span>
                <span className="text-[10px] text-sky-700">Sofía M.</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="flex flex-col items-center p-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-purple-900 transition"
              >
                <ShieldCheck className="w-5 h-5 text-purple-600 mb-1" />
                <span className="text-xs font-bold">Admin</span>
                <span className="text-[10px] text-purple-700">Dra. Ramos</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-medical-500/20 focus:border-medical-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rol deseado
              </label>
              <select
                value={roleSelect}
                onChange={(e) => setRoleSelect(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white"
              >
                <option value="doctor">Médico / Especialista</option>
                <option value="patient">Paciente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-md shadow-medical-500/25 text-sm font-bold text-white bg-medical-600 hover:bg-medical-700 focus:outline-none transition disabled:opacity-50"
            >
              <span>{isLoading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
