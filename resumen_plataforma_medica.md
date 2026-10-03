# MedFit Clinical — Plataforma Médica de Nutrición, Rutinas y Prescripción

Este documento describe la arquitectura, características y guía de uso de la plataforma médica implementada para doctores, pacientes y administradores conforme a la especificación en [README.md](file:///home/isaac/antigravity/valiant-davinci/README.md).

---

## 1. Pila Tecnológica Implementada

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Front-end** | [React 19](file:///home/isaac/antigravity/valiant-davinci/package.json) + [Vite](file:///home/isaac/antigravity/valiant-davinci/vite.config.ts) | Renderizado ultra veloz y arquitectura de componentes moderna |
| **Lenguaje** | [TypeScript](file:///home/isaac/antigravity/valiant-davinci/src/types/index.ts) | Tipado estricto para modelos médicos, recetas, dietas y macros |
| **Estilos y UI** | [Tailwind CSS v3](file:///home/isaac/antigravity/valiant-davinci/tailwind.config.js) + Lucide Icons | Diseño clínico moderno, tipografías Google Fonts (*Inter* + *Plus Jakarta Sans*) y componentes *glassmorphism* |
| **BaaS / Base de Datos** | [Supabase](file:///home/isaac/antigravity/valiant-davinci/src/lib/supabaseClient.ts) (`@supabase/supabase-js`) | PostgreSQL, Auth con roles, Row Level Security (RLS) y Storage |
| **Esquema SQL** | [supabase/schema.sql](file:///home/isaac/antigravity/valiant-davinci/supabase/schema.sql) | Script listo para ejecutar con tablas, índices, triggers y políticas RLS |

---

## 2. Demostración y Verificación Visual

A continuación se presentan las capturas de pantalla tomadas durante la validación automatizada en el navegador:

````carousel
![Dashboard del Médico - Directorio de Pacientes y Pestañas Clínicas](/home/isaac/.gemini/antigravity-ide/brain/969c6e3e-be4c-48a6-a33c-123991fc8c02/doctor_dashboard_patients_1790947717892.png)
<!-- slide -->
![Modal de Prescripción de Indicaciones Médicas con Posología](/home/isaac/.gemini/antigravity-ide/brain/969c6e3e-be4c-48a6-a33c-123991fc8c02/modal_prescribir_indicacion_1790947797239.png)
<!-- slide -->
![Portal del Paciente - Checklist Diario Interactivo y Cálculo de Adherencia](/home/isaac/.gemini/antigravity-ide/brain/969c6e3e-be4c-48a6-a33c-123991fc8c02/patient_portal_mi_dia_hoy_1790947861043.png)
<!-- slide -->
![Portal del Paciente - Rutina de Ejercicio y Temporizador de Descanso](/home/isaac/.gemini/antigravity-ide/brain/969c6e3e-be4c-48a6-a33c-123991fc8c02/patient_portal_mi_rutina_timer_1790947969555.png)
<!-- slide -->
![Panel de Administración - Métricas y Guía de Infraestructura Supabase](/home/isaac/.gemini/antigravity-ide/brain/969c6e3e-be4c-48a6-a33c-123991fc8c02/admin_dashboard_1790948027906.png)
````

> [!TIP]
> Puedes revisar el video completo de la sesión de prueba generada por el agente de navegador en:
> ![Demostración en video](/home/isaac/.gemini/antigravity-ide/brain/969c6e3e-be4c-48a6-a33c-123991fc8c02/medical_platform_demo_1790947666703.webp)

---

## 3. Funcionalidades por Rol de Usuario

### 👨‍⚕️ 1. Módulo del Médico ([DoctorDashboard.tsx](file:///home/isaac/antigravity/valiant-davinci/src/pages/doctor/DoctorDashboard.tsx))
- **Directorio de Pacientes**: Búsqueda en tiempo real, filtro por estado (Activo/Inactivo), cálculo automático de IMC y alerta destacada de alergias / contraindicaciones clínicas.
- **Prescripción de Indicaciones Clínicas**: Formulario modal para emitir medicamentos (dosis, posología y frecuencia), hidratación con electrolitos, recomendaciones de estilo de vida y alertas preventivas.
- **Diseñador de Dietas**: Definición de objetivo calórico diario (kcal), desglose de macronutrientes (Proteínas, Carbohidratos, Grasas) con visualizador gráfico, y distribución de tiempos de comida (Desayuno, Colación, Almuerzo, Merienda, Cena).
- **Prescripción de Entrenamiento**: Creación de rutinas según nivel (Principiante, Intermedio, Avanzado), frecuencia semanal, ejercicios por día, series, repeticiones y tiempo de recuperación.
- **Seguimiento Clínico**: Consulta de pesajes periódicos, % de grasa corporal y adherencia del paciente.

### 🧘‍♀️ 2. Portal del Paciente ([PatientPortal.tsx](file:///home/isaac/antigravity/valiant-davinci/src/pages/patient/PatientPortal.tsx))
- **Mi Día Hoy**: Checklist interactivo donde el paciente marca en tiempo real cada toma de medicamento, consumo de agua y comida completada, actualizando la barra de adherencia diaria.
- **Mis Indicaciones Médicas**: Tarjetas claras con indicaciones oficiales de su médico tratante.
- **Mi Dieta de Hoy**: Visor con horarios, lista de alimentos sugeridos y recomendaciones del doctor.
- **Mi Rutina**: Guía paso a paso de los ejercicios asignados con temporizador dinámico de descanso (*45s, 60s, 90s*).
- **Mi Progreso**: Formulario para registrar pesaje diario, nivel de energía (estrellas) y notas para su médico.

### 🛡️ 3. Panel de Administración ([AdminDashboard.tsx](file:///home/isaac/antigravity/valiant-davinci/src/pages/admin/AdminDashboard.tsx))
- Métricas globales de pacientes en tratamiento, médicos registrados, tratamientos activos y porcentaje de adherencia.
- Directorio de médicos y especialistas con cantidad de pacientes asignados.
- Monitor de estado de conexión a Supabase y guía para ejecución del script de base de datos.

---

## 4. Guía para Conectar Supabase en Vivo

1. **Crear Proyecto en Supabase**:
   Crea un proyecto en [supabase.com](https://supabase.com).
2. **Ejecutar el Esquema SQL**:
   Abre el **SQL Editor** en tu panel de Supabase, copia el contenido de [supabase/schema.sql](file:///home/isaac/antigravity/valiant-davinci/supabase/schema.sql) y haz clic en **Run**. Esto creará:
   - Tablas `profiles`, `patients`, `medical_indications`, `diets`, `diet_meals`, `routines`, `routine_exercises`, `patient_progress`.
   - Políticas RLS para que los pacientes solo puedan ver sus propios datos y los médicos gestionen los suyos.
   - Triggers automáticos para creación de perfiles al registrarse.
3. **Configurar Variables de Entorno**:
   Copia [.env.example](file:///home/isaac/antigravity/valiant-davinci/.env.example) a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Y completa tus credenciales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
   La aplicación detectará automáticamente las credenciales y cambiará de **Modo Demo Local** a **Supabase Activo**.
