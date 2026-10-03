import { UserProfile, Patient, MedicalIndication, DietPlan, RoutinePlan, PatientProgress } from '../types';

export const mockUsers: UserProfile[] = [
  {
    id: 'doc-1',
    email: 'dr.valdez@medfit.com',
    fullName: 'Dr. Alejandro Valdez',
    role: 'doctor',
    specialty: 'Medicina Deportiva y Nutrición Clínica',
    phone: '+52 55 4123 8901',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'pat-user-1',
    email: 'sofia.martinez@email.com',
    fullName: 'Sofía Martínez',
    role: 'patient',
    phone: '+52 55 9876 5432',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-02-15T11:30:00Z',
  },
  {
    id: 'pat-user-2',
    email: 'carlos.mendoza@email.com',
    fullName: 'Carlos Mendoza',
    role: 'patient',
    phone: '+52 55 1234 5678',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-03-01T09:00:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@medfit.com',
    fullName: 'Dra. Elena Ramos (Admin)',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-01T00:00:00Z',
  }
];

export const mockPatients: Patient[] = [
  {
    id: 'pat-1',
    userId: 'pat-user-1',
    doctorId: 'doc-1',
    fullName: 'Sofía Martínez',
    email: 'sofia.martinez@email.com',
    phone: '+52 55 9876 5432',
    birthDate: '1995-06-14',
    gender: 'female',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Mariscos'],
    medicalHistory: 'Resistencia a la insulina leve diagnosticada en 2023. Sin cirugías previas.',
    currentWeight: 68.5,
    targetWeight: 60.0,
    height: 165,
    status: 'active',
    lastVisit: '2026-09-28',
    createdAt: '2024-02-15T11:30:00Z',
  },
  {
    id: 'pat-2',
    userId: 'pat-user-2',
    doctorId: 'doc-1',
    fullName: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    phone: '+52 55 1234 5678',
    birthDate: '1988-11-22',
    gender: 'male',
    bloodType: 'A+',
    allergies: ['AINEs (Ibuprofeno)'],
    medicalHistory: 'Hipertensión grado 1 controlada. Lesión antigua en ligamento cruzado anterior derecho.',
    currentWeight: 89.2,
    targetWeight: 80.0,
    height: 178,
    status: 'active',
    lastVisit: '2026-09-25',
    createdAt: '2024-03-01T09:00:00Z',
  },
  {
    id: 'pat-3',
    userId: 'pat-user-3',
    doctorId: 'doc-1',
    fullName: 'Mariana Herrera',
    email: 'mariana.herrera@email.com',
    phone: '+52 55 7788 9900',
    birthDate: '2001-04-03',
    gender: 'female',
    bloodType: 'B+',
    allergies: ['Lactosa'],
    medicalHistory: 'Atleta de medio fondo. Evaluación para ganancia de masa muscular y recuperación óptima.',
    currentWeight: 54.0,
    targetWeight: 56.5,
    height: 162,
    status: 'active',
    lastVisit: '2026-09-30',
    createdAt: '2024-05-10T14:20:00Z',
  }
];

export const mockIndications: MedicalIndication[] = [
  {
    id: 'ind-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    title: 'Metformina 500mg con Alimentos',
    description: 'Tomar 1 tableta inmediatamente con la cena para mejorar sensibilidad a la insulina y evitar molestias gástricas.',
    category: 'medication',
    dosage: '500 mg',
    frequency: 'Cada 24 horas (Cena)',
    startDate: '2026-09-28',
    endDate: '2026-12-28',
    isActive: true,
    createdAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'ind-2',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    title: 'Pauta de Hidratación con Electrolitos',
    description: 'Consumir mínimo 2.5 litros de agua filtrada al día. Agregar una pizca de sal del Himalaya y limón en ayunas.',
    category: 'hydration',
    dosage: '2.5 L al día',
    frequency: 'Continuo durante todo el día',
    startDate: '2026-09-28',
    isActive: true,
    createdAt: '2026-09-28T16:05:00Z',
  },
  {
    id: 'ind-3',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    title: 'Higiene del Sueño y Reducción de Cortisol',
    description: 'Suspender pantallas y luz azul 60 minutos antes de dormir. Procurar 7 a 8 horas de sueño continuo.',
    category: 'lifestyle',
    dosage: '7-8 horas de descanso',
    frequency: 'Diario antes de las 23:00',
    startDate: '2026-09-28',
    isActive: true,
    createdAt: '2026-09-28T16:10:00Z',
  },
  {
    id: 'ind-4',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    title: 'Precaución con Azúcares Refinados y Harinas Blancas',
    description: 'Evitar jugos de frutas procesados, refrescos y harinas refinadas que eleven picos de glucemia.',
    category: 'warning',
    frequency: 'Permanente',
    startDate: '2026-09-28',
    isActive: true,
    createdAt: '2026-09-28T16:15:00Z',
  },
  {
    id: 'ind-5',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    title: 'Losartán 50mg Matutino',
    description: 'Monitorear presión arterial 2 veces por semana y registrarla en el portal.',
    category: 'medication',
    dosage: '50 mg',
    frequency: 'Cada mañana en ayunas',
    startDate: '2026-09-25',
    isActive: true,
    createdAt: '2026-09-25T11:00:00Z',
  }
];

export const mockDiets: DietPlan[] = [
  {
    id: 'diet-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    name: 'Plan Metabólico Antiinflamatorio y Déficit Calórico Controlado',
    description: 'Diseñado para reducir porcentaje de grasa corporal preservando masa muscular y estabilizando glucosa en sangre.',
    dailyCalories: 1650,
    macros: {
      protein: 125, // gramos
      carbs: 140,
      fats: 55,
    },
    notes: 'Priorizar cocción al vapor, plancha o freidora de aire. Evitar fritos y rebozados.',
    status: 'active',
    createdAt: '2026-09-28T17:00:00Z',
    meals: [
      {
        id: 'm-1',
        time: '08:00 AM',
        title: 'Desayuno Proteico y Fibra',
        calories: 380,
        proteinGrams: 28,
        carbsGrams: 32,
        fatGrams: 14,
        foods: [
          '3 claras de huevo + 1 huevo entero revuelto con espinacas y champiñones',
          '1 rebanada de pan de masa madre tostado',
          '1/3 de aguacate mediano',
          '1 taza de té verde o café negro sin azúcar'
        ],
        recommendations: 'No usar aceites refinados, rocío de aceite de oliva virgen extra.'
      },
      {
        id: 'm-2',
        time: '11:30 AM',
        title: 'Snack de Media Mañana',
        calories: 180,
        proteinGrams: 15,
        carbsGrams: 12,
        fatGrams: 7,
        foods: [
          '150g de yogur griego natural sin azúcar añadida',
          '1 puñado pequeño de frutos rojos (arándanos o frambuesas)',
          '10 almendras naturales tostadas'
        ]
      },
      {
        id: 'm-3',
        time: '02:30 PM',
        title: 'Almuerzo Principal Equilibrado',
        calories: 540,
        proteinGrams: 42,
        carbsGrams: 50,
        fatGrams: 18,
        foods: [
          '150g de pechuga de pollo a la plancha o salmón fresco',
          '1 taza de quinoa cocida o arroz integral',
          'Ensalada abundante: rúcula, pepino, tomate cherry con aderezo de limón y 1 cdta de aceite de oliva'
        ],
        recommendations: 'Masticar despacio, dedicar al menos 20 minutos al almuerzo.'
      },
      {
        id: 'm-4',
        time: '05:30 PM',
        title: 'Merienda Pre-Entreno',
        calories: 190,
        proteinGrams: 12,
        carbsGrams: 24,
        fatGrams: 4,
        foods: [
          '1 manzana verde en rodajas con 1 cucharadita de crema de cacahuate sin azúcar',
          '1 infusión fría de manzanilla o menta'
        ]
      },
      {
        id: 'm-5',
        time: '08:30 PM',
        title: 'Cena Liviana y Reparadora',
        calories: 360,
        proteinGrams: 28,
        carbsGrams: 22,
        fatGrams: 12,
        foods: [
          '140g de filete de pescado blanco (merluza o tilapia) al horno con hierbas finas',
          'Espárragos y calabacines asados',
          'Media taza de puré de camote (boniato)'
        ],
        recommendations: 'Tomar la pastilla indicada de Metformina en el primer bocado.'
      }
    ]
  },
  {
    id: 'diet-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    name: 'Plan DASH y Control de Presión Arterial',
    description: 'Enfocado en sodio bajo (<1500mg), alto en potasio y magnesio.',
    dailyCalories: 2100,
    macros: {
      protein: 160,
      carbs: 210,
      fats: 65,
    },
    status: 'active',
    createdAt: '2026-09-25T12:00:00Z',
    meals: [
      {
        id: 'm-201',
        time: '08:30 AM',
        title: 'Desayuno Cardiosaludable',
        calories: 450,
        proteinGrams: 30,
        carbsGrams: 55,
        fatGrams: 12,
        foods: ['Bowl de avena integral con proteína vegetal, plátano y semillas de chía'],
      }
    ]
  }
];

export const mockRoutines: RoutinePlan[] = [
  {
    id: 'rout-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    name: 'Rutina Funcional, Fuerza y Salud Metabólica',
    description: 'Enfocada en reclutamiento de grandes grupos musculares para optimizar captación de glucosa por contracción muscular.',
    level: 'beginner',
    frequencyDaysPerWeek: 4,
    targetGoal: 'Composición corporal, acondicionamiento y mejora de sensibilidad a la insulina',
    status: 'active',
    createdAt: '2026-09-28T18:00:00Z',
    exercises: [
      {
        id: 'ex-1',
        day: 'Día 1: Tren Inferior y Core (Lunes)',
        name: 'Sentadilla Goblet con Mancuerna',
        muscleGroup: 'Cuádriceps y Glúteos',
        sets: 4,
        reps: '12 repeticiones',
        restSeconds: 75,
        instructions: 'Mantener la espalda recta, pecho erguido y bajar controlando 2 segundos. Peso inicial sugerido: 6-8 kg.',
        videoUrl: 'https://www.youtube.com/watch?v=MeIiIdhvXT4'
      },
      {
        id: 'ex-2',
        day: 'Día 1: Tren Inferior y Core (Lunes)',
        name: 'Puente de Glúteos en Suelo con Pausa',
        muscleGroup: 'Glúteos e Isquiosurales',
        sets: 3,
        reps: '15 repeticiones (sostener 2s arriba)',
        restSeconds: 60,
        instructions: 'Empujar fuerte desde los talones, apretando el abdomen para no sobrecargar zona lumbar.',
      },
      {
        id: 'ex-3',
        day: 'Día 1: Tren Inferior y Core (Lunes)',
        name: 'Plancha Abdominal Frontal',
        muscleGroup: 'Core / Abdomen',
        sets: 3,
        reps: '30-40 segundos',
        restSeconds: 45,
        instructions: 'Alinear codos bajo hombros, evitar que la cadera caiga o se eleve en exceso.',
      },
      {
        id: 'ex-4',
        day: 'Día 2: Tren Superior y Postura (Martes)',
        name: 'Remo con Mancuernas con Apoyo en Banco',
        muscleGroup: 'Dorsales y Romboide',
        sets: 4,
        reps: '12 repeticiones por lado',
        restSeconds: 60,
        instructions: 'Codo pegado al torso, retracción escapular al final del recorrido.',
      },
      {
        id: 'ex-5',
        day: 'Día 2: Tren Superior y Postura (Martes)',
        name: 'Press Militar con Mancuernas Sentada',
        muscleGroup: 'Hombros y Tríceps',
        sets: 3,
        reps: '10 repeticiones',
        restSeconds: 60,
        instructions: 'Empujar verticalmente sin arquear la espalda baja.',
      },
      {
        id: 'ex-6',
        day: 'Día 3: Circuito Metabólico y Cardio HIIT Ligero (Jueves)',
        name: 'Caminata inclinada o Elíptica en Intervalos',
        muscleGroup: 'Cardiovascular',
        sets: 1,
        reps: '25 minutos (2 min suave / 1 min moderado)',
        restSeconds: 0,
        instructions: 'Mantener frecuencia cardíaca en zona 2 (120-135 bpm).',
      }
    ]
  },
  {
    id: 'rout-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    name: 'Acondicionamiento Físico Seguro para Rodilla',
    description: 'Carga progresiva sin impacto articular agresivo.',
    level: 'intermediate',
    frequencyDaysPerWeek: 3,
    targetGoal: 'Fuerza funcional y protección de ligamentos',
    status: 'active',
    createdAt: '2026-09-25T13:00:00Z',
    exercises: [
      {
        id: 'ex-201',
        day: 'Día 1: Movilidad y Fuerza',
        name: 'Prensa inclinada con pies altos',
        muscleGroup: 'Piernas',
        sets: 4,
        reps: '10 repeticiones',
        restSeconds: 90,
      }
    ]
  }
];

export const mockProgress: PatientProgress[] = [
  {
    id: 'prog-1',
    patientId: 'pat-1',
    date: '2026-08-15',
    weight: 71.2,
    bodyFatPercentage: 31.5,
    waistCircumference: 84,
    energyLevel: 3,
    adherenceRate: 80,
    notes: 'Primera consulta médica. Inicio de cambios en hábitos alimentarios.'
  },
  {
    id: 'prog-2',
    patientId: 'pat-1',
    date: '2026-09-01',
    weight: 70.0,
    bodyFatPercentage: 30.2,
    waistCircumference: 82,
    energyLevel: 4,
    adherenceRate: 85,
    notes: 'Mejor digestión, menos pesadez por la tarde.'
  },
  {
    id: 'prog-3',
    patientId: 'pat-1',
    date: '2026-09-15',
    weight: 69.1,
    bodyFatPercentage: 29.4,
    waistCircumference: 80.5,
    energyLevel: 4,
    adherenceRate: 90,
    notes: 'Mayor constancia con la rutina de ejercicios.'
  },
  {
    id: 'prog-4',
    patientId: 'pat-1',
    date: '2026-09-28',
    weight: 68.5,
    bodyFatPercentage: 28.6,
    waistCircumference: 79.0,
    energyLevel: 5,
    adherenceRate: 95,
    notes: 'Excelente adherencia. Metformina bien tolerada con la cena.'
  }
];
