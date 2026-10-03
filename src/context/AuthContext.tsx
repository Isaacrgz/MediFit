import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Patient } from '../types';
import { mockUsers, mockPatients } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  currentPatient: Patient | null;
  role: UserRole | null;
  isLoading: boolean;
  isLiveSupabase: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchUserRole: (role: UserRole) => void;
  selectPatientForView: (patientId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('medfit_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return mockUsers[0]; }
    }
    return mockUsers[0]; // Default: Doctor
  });

  const [currentPatient, setCurrentPatient] = useState<Patient | null>(() => {
    return mockPatients[0];
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('medfit_user', JSON.stringify(user));
      if (user.role === 'patient') {
        const found = mockPatients.find(p => p.userId === user.id) || mockPatients[0];
        setCurrentPatient(found);
      }
    } else {
      localStorage.removeItem('medfit_user');
    }
  }, [user]);

  // Si Supabase está configurado con claves reales, sincronizar sesión
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              role: profile.role,
              avatarUrl: profile.avatar_url,
              phone: profile.phone,
              specialty: profile.specialty,
              createdAt: profile.created_at,
            });
          }
        }
      } catch (err) {
        console.warn('Supabase auth session sync notice:', err);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, rolePreference?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        // En producción Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'password123'
        });
        if (error) {
          console.warn('Supabase auth fallback:', error.message);
        } else if (data.user) {
          return true;
        }
      }

      // Demo/Fallback login
      const matched = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        setUser(matched);
      } else {
        const targetRole = rolePreference || 'doctor';
        const newUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email,
          fullName: email.split('@')[0],
          role: targetRole,
          createdAt: new Date().toISOString()
        };
        setUser(newUser);
      }
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('medfit_user');
  };

  const switchUserRole = (role: UserRole) => {
    const candidate = mockUsers.find(u => u.role === role);
    if (candidate) {
      setUser(candidate);
      if (role === 'patient') {
        const pat = mockPatients.find(p => p.userId === candidate.id) || mockPatients[0];
        setCurrentPatient(pat);
      }
    }
  };

  const selectPatientForView = (patientId: string) => {
    const pat = mockPatients.find(p => p.id === patientId);
    if (pat) {
      setCurrentPatient(pat);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentPatient,
        role: user?.role || null,
        isLoading,
        isLiveSupabase: isSupabaseConfigured,
        login,
        logout,
        switchUserRole,
        selectPatientForView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
