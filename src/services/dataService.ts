import { Patient, MedicalIndication, DietPlan, RoutinePlan, PatientProgress } from '../types';
import { mockPatients, mockIndications, mockDiets, mockRoutines, mockProgress } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

class DataService {
  private patients: Patient[] = [...mockPatients];
  private indications: MedicalIndication[] = [...mockIndications];
  private diets: DietPlan[] = [...mockDiets];
  private routines: RoutinePlan[] = [...mockRoutines];
  private progress: PatientProgress[] = [...mockProgress];

  // ===================== PACIENTES =====================
  async getPatients(doctorId?: string): Promise<Patient[]> {
    if (isSupabaseConfigured) {
      let query = supabase.from('patients').select('*');
      if (doctorId) query = query.eq('doctor_id', doctorId);
      const { data, error } = await query;
      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          userId: item.user_id,
          doctorId: item.doctor_id,
          fullName: item.full_name,
          email: item.email,
          phone: item.phone,
          birthDate: item.birth_date,
          gender: item.gender,
          bloodType: item.blood_type,
          allergies: item.allergies,
          medicalHistory: item.medical_history,
          currentWeight: item.current_weight,
          targetWeight: item.target_weight,
          height: item.height,
          status: item.status,
          createdAt: item.created_at,
        }));
      }
    }
    return this.patients;
  }

  async getPatientById(id: string): Promise<Patient | undefined> {
    const list = await this.getPatients();
    return list.find(p => p.id === id);
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data } = await supabase.from('patients').insert([{
        user_id: patient.userId,
        doctor_id: patient.doctorId,
        full_name: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        birth_date: patient.birthDate,
        gender: patient.gender,
        blood_type: patient.bloodType,
        allergies: patient.allergies,
        medical_history: patient.medicalHistory,
        current_weight: patient.currentWeight,
        target_weight: patient.targetWeight,
        height: patient.height,
        status: patient.status,
      }]).select().single();
      if (data) return data;
    }

    this.patients.unshift(newPatient);
    return newPatient;
  }

  // ===================== INDICACIONES MÉDICAS =====================
  async getIndications(patientId: string): Promise<MedicalIndication[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('medical_indications')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          patientId: item.patient_id,
          doctorId: item.doctor_id,
          title: item.title,
          description: item.description,
          category: item.category,
          dosage: item.dosage,
          frequency: item.frequency,
          startDate: item.start_date,
          endDate: item.end_date,
          isActive: item.is_active,
          createdAt: item.created_at,
        }));
      }
    }
    return this.indications.filter(ind => ind.patientId === patientId);
  }

  async createIndication(indication: Omit<MedicalIndication, 'id' | 'createdAt'>): Promise<MedicalIndication> {
    const newIndication: MedicalIndication = {
      ...indication,
      id: `ind-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data } = await supabase.from('medical_indications').insert([{
        patient_id: indication.patientId,
        doctor_id: indication.doctorId,
        title: indication.title,
        description: indication.description,
        category: indication.category,
        dosage: indication.dosage,
        frequency: indication.frequency,
        start_date: indication.startDate,
        end_date: indication.endDate,
        is_active: indication.isActive,
      }]).select().single();
      if (data) return data;
    }

    this.indications.unshift(newIndication);
    return newIndication;
  }

  async toggleIndicationStatus(id: string): Promise<boolean> {
    const item = this.indications.find(i => i.id === id);
    if (item) {
      item.isActive = !item.isActive;
      if (isSupabaseConfigured) {
        await supabase.from('medical_indications').update({ is_active: item.isActive }).eq('id', id);
      }
      return true;
    }
    return false;
  }

  // ===================== DIETAS =====================
  async getDiets(patientId: string): Promise<DietPlan[]> {
    if (isSupabaseConfigured) {
      const { data: dietsData } = await supabase
        .from('diets')
        .select('*, diet_meals(*)')
        .eq('patient_id', patientId);

      if (dietsData) {
        return dietsData.map(d => ({
          id: d.id,
          patientId: d.patient_id,
          doctorId: d.doctor_id,
          name: d.name,
          description: d.description,
          dailyCalories: d.daily_calories,
          macros: {
            protein: d.protein_grams,
            carbs: d.carbs_grams,
            fats: d.fat_grams,
          },
          notes: d.notes,
          status: d.status,
          createdAt: d.created_at,
          meals: (d.diet_meals || []).map((m: any) => ({
            id: m.id,
            time: m.time_label,
            title: m.title,
            foods: m.foods,
            calories: m.calories,
            proteinGrams: m.protein_grams,
            carbsGrams: m.carbs_grams,
            fatGrams: m.fat_grams,
            recommendations: m.recommendations,
          }))
        }));
      }
    }
    return this.diets.filter(d => d.patientId === patientId);
  }

  async createDiet(diet: Omit<DietPlan, 'id' | 'createdAt'>): Promise<DietPlan> {
    const newDiet: DietPlan = {
      ...diet,
      id: `diet-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.diets.unshift(newDiet);
    return newDiet;
  }

  // ===================== RUTINAS =====================
  async getRoutines(patientId: string): Promise<RoutinePlan[]> {
    if (isSupabaseConfigured) {
      const { data: routinesData } = await supabase
        .from('routines')
        .select('*, routine_exercises(*)')
        .eq('patient_id', patientId);

      if (routinesData) {
        return routinesData.map(r => ({
          id: r.id,
          patientId: r.patient_id,
          doctorId: r.doctor_id,
          name: r.name,
          description: r.description,
          level: r.level,
          frequencyDaysPerWeek: r.frequency_days_per_week,
          targetGoal: r.target_goal,
          status: r.status,
          createdAt: r.created_at,
          exercises: (r.routine_exercises || []).map((e: any) => ({
            id: e.id,
            day: e.day_label,
            name: e.name,
            muscleGroup: e.muscle_group,
            sets: e.sets,
            reps: e.reps,
            restSeconds: e.rest_seconds,
            instructions: e.instructions,
            videoUrl: e.video_url,
          }))
        }));
      }
    }
    return this.routines.filter(r => r.patientId === patientId);
  }

  async createRoutine(routine: Omit<RoutinePlan, 'id' | 'createdAt'>): Promise<RoutinePlan> {
    const newRoutine: RoutinePlan = {
      ...routine,
      id: `rout-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.routines.unshift(newRoutine);
    return newRoutine;
  }

  // ===================== PROGRESO =====================
  async getProgress(patientId: string): Promise<PatientProgress[]> {
    return this.progress
      .filter(p => p.patientId === patientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async addProgress(entry: Omit<PatientProgress, 'id'>): Promise<PatientProgress> {
    const newEntry: PatientProgress = {
      ...entry,
      id: `prog-${Date.now()}`,
    };
    this.progress.push(newEntry);
    return newEntry;
  }
}

export const dataService = new DataService();
