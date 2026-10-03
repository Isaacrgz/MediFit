export type UserRole = 'admin' | 'doctor' | 'patient';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  specialty?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  doctorId: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string;
  currentWeight: number; // in kg
  targetWeight: number; // in kg
  height: number; // in cm
  status: 'active' | 'inactive' | 'pending';
  lastVisit?: string;
  createdAt: string;
}

export type IndicationCategory = 'medication' | 'hydration' | 'lifestyle' | 'warning' | 'general';

export interface MedicalIndication {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  category: IndicationCategory;
  dosage?: string;
  frequency?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Meal {
  id: string;
  time: string;
  title: string;
  foods: string[];
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  recommendations?: string;
}

export interface DietPlan {
  id: string;
  patientId: string;
  doctorId: string;
  name: string;
  description?: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
  notes?: string;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Exercise {
  id: string;
  day: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions?: string;
  videoUrl?: string;
}

export interface RoutinePlan {
  id: string;
  patientId: string;
  doctorId: string;
  name: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  frequencyDaysPerWeek: number;
  targetGoal: string;
  exercises: Exercise[];
  status: 'active' | 'archived';
  createdAt: string;
}

export interface PatientProgress {
  id: string;
  patientId: string;
  date: string;
  weight: number;
  bodyFatPercentage?: number;
  waistCircumference?: number;
  notes?: string;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  adherenceRate?: number; // 0 - 100%
  imageUrl?: string;
}
