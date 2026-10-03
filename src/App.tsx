import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientPortal } from './pages/patient/PatientPortal';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LoginPage } from './pages/auth/LoginPage';

const MainLayout: React.FC = () => {
  const { user, role } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  if (!user) {
    return <LoginPage onSuccess={() => setCurrentTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
      <main className="flex-1 pb-16">
        {role === 'doctor' && <DoctorDashboard />}
        {role === 'patient' && <PatientPortal />}
        {role === 'admin' && <AdminDashboard />}
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 MedFit Clinical Portal — Sistema Integral de Prescripción Médica, Nutrición y Entrenamiento</p>
          <p className="text-slate-400">Desarrollado para Médicos y Pacientes</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
