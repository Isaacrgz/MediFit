-- ==========================================================
-- Plataforma Médica de Nutrición y Entrenamiento
-- Esquema de Base de Datos PostgreSQL para Supabase + RLS
-- ==========================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TIPO DE ROL
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'patient');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PERFILES DE USUARIO (Extensión de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    avatar_url TEXT,
    phone TEXT,
    specialty TEXT, -- Exclusivo para doctores
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. PACIENTES (Ficha clínica y relación con el médico)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    blood_type TEXT,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    medical_history TEXT,
    current_weight NUMERIC(5,2), -- en kg
    target_weight NUMERIC(5,2),  -- en kg
    height NUMERIC(5,2),         -- en cm
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. INDICACIONES MÉDICAS
CREATE TABLE IF NOT EXISTS public.medical_indications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('medication', 'hydration', 'lifestyle', 'warning', 'general')),
    dosage TEXT,
    frequency TEXT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. PLANES DE DIETA
CREATE TABLE IF NOT EXISTS public.diets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    daily_calories INTEGER NOT NULL DEFAULT 2000,
    protein_grams INTEGER NOT NULL DEFAULT 150,
    carbs_grams INTEGER NOT NULL DEFAULT 200,
    fat_grams INTEGER NOT NULL DEFAULT 60,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. COMIDAS / HORARIOS DE LA DIETA
CREATE TABLE IF NOT EXISTS public.diet_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diet_id UUID NOT NULL REFERENCES public.diets(id) ON DELETE CASCADE,
    time_label TEXT NOT NULL, -- Ej: '08:00 AM'
    title TEXT NOT NULL,      -- Ej: 'Desayuno Proteico'
    foods TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    calories INTEGER DEFAULT 0,
    protein_grams INTEGER DEFAULT 0,
    carbs_grams INTEGER DEFAULT 0,
    fat_grams INTEGER DEFAULT 0,
    recommendations TEXT,
    order_index INTEGER DEFAULT 0
);

-- 8. PLANES DE RUTINAS / ENTRENAMIENTO
CREATE TABLE IF NOT EXISTS public.routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    frequency_days_per_week INTEGER NOT NULL DEFAULT 4,
    target_goal TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. EJERCICIOS DE LA RUTINA
CREATE TABLE IF NOT EXISTS public.routine_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
    day_label TEXT NOT NULL, -- Ej: 'Lunes / Día 1'
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    reps TEXT NOT NULL DEFAULT '10-12 reps',
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    instructions TEXT,
    video_url TEXT,
    order_index INTEGER DEFAULT 0
);

-- 10. AVANCES Y SEGUIMIENTO DEL PACIENTE
CREATE TABLE IF NOT EXISTS public.patient_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight NUMERIC(5,2) NOT NULL,
    body_fat_percentage NUMERIC(4,2),
    waist_circumference NUMERIC(5,2),
    energy_level SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
    adherence_rate INTEGER CHECK (adherence_rate BETWEEN 0 AND 100),
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_indications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_progress ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. Patients
CREATE POLICY "Doctors can manage their patients" 
ON public.patients FOR ALL TO authenticated 
USING (doctor_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Patients can view their patient record" 
ON public.patients FOR SELECT TO authenticated 
USING (user_id = auth.uid());

-- 3. Medical Indications
CREATE POLICY "Doctors manage indications" 
ON public.medical_indications FOR ALL TO authenticated 
USING (doctor_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Patients view their indications" 
ON public.medical_indications FOR SELECT TO authenticated 
USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- 4. Diets & Meals
CREATE POLICY "Doctors manage diets" 
ON public.diets FOR ALL TO authenticated 
USING (doctor_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Patients view their diets" 
ON public.diets FOR SELECT TO authenticated 
USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

CREATE POLICY "Read diet meals" 
ON public.diet_meals FOR SELECT TO authenticated USING (true);

CREATE POLICY "Doctors manage diet meals" 
ON public.diet_meals FOR ALL TO authenticated 
USING (diet_id IN (SELECT id FROM public.diets WHERE doctor_id = auth.uid()));

-- 5. Routines & Exercises
CREATE POLICY "Doctors manage routines" 
ON public.routines FOR ALL TO authenticated 
USING (doctor_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Patients view their routines" 
ON public.routines FOR SELECT TO authenticated 
USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

CREATE POLICY "Read routine exercises" 
ON public.routine_exercises FOR SELECT TO authenticated USING (true);

CREATE POLICY "Doctors manage routine exercises" 
ON public.routine_exercises FOR ALL TO authenticated 
USING (routine_id IN (SELECT id FROM public.routines WHERE doctor_id = auth.uid()));

-- 6. Progress
CREATE POLICY "Doctors view patient progress" 
ON public.patient_progress FOR SELECT TO authenticated 
USING (patient_id IN (SELECT id FROM public.patients WHERE doctor_id = auth.uid()));

CREATE POLICY "Patients manage their own progress" 
ON public.patient_progress FOR ALL TO authenticated 
USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()))
WITH CHECK (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- Trigger para nuevo usuario registrado -> Crear perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'patient'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
