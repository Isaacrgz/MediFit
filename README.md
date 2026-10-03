# Plataforma Médica de Nutrición y Entrenamiento - Especificación de Proyecto (Front-end)

Este documento sirve como guía contextual para el desarrollo del front-end de la aplicación web médica utilizando **Antigravity**.

---

## 1. Contexto General del Proyecto

Plataforma web para un médico/nutriólogo orientada a la gestión, asignación y seguimiento de dietas y rutinas de entrenamiento para pacientes.

### Tipos de Usuarios / Roles

1. **Administrador:** Gestión global del sistema, médicos y métricas generales.
2. **Doctor:** Gestión de expedientes, asignación de dietas, planes de entrenamiento y seguimiento de pacientes.
3. **Paciente:** Visualización de dietas diarias, rutinas de ejercicio asignadas y registro de avance.

---

## 2. Pila Tecnológica (Tech Stack)

* **Framework Front-end:** React 18+ (con Vite)
* **Lenguaje:** JavaScript / TypeScript
* **Estilos / UI:** Tailwind CSS + Lucide Icons (o componentes Headless UI)
* **Backend / BaaS:** Supabase (`@supabase/supabase-js`)
  * Autenticación (Auth con soporte para metadatos de roles)
  * Base de datos PostgreSQL + Row Level Security (RLS)
  * Supabase Storage (para archivos PDF, imágenes de progreso)
* **Despliegue & Hosting:** Vercel

---

## 3. Estructura de Directorios del Proyecto

```text
frontend/
├── public/
├── src/
│   ├── assets/          # Imágenes estáticas y recursos
│   ├── components/      # Componentes reutilizables de UI (Botones, Inputs, Modales)
│   ├── context/         # AuthContext y estados globales
│   ├── hooks/           # Custom hooks (useAuth, usePatientData, etc.)
│   ├── lib/             # Instancia e inicialización de Supabase (`supabaseClient.js`)
│   ├── pages/           # Vistas según rol
│   │   ├── auth/        # Login, Registro, Recuperar Contraseña
│   │   ├── admin/       # Dashboard de Administración
│   │   ├── doctor/      # Dashboard del Doctor (Pacientes, Asignación de Dietas)
│   │   └── patient/     # Portal del Paciente (Dietas, Rutinas, Avances)
│   ├── routes/          # Protección de rutas por Roles (ProtectedRoute.jsx)
│   ├── services/        # Consultas y mutaciones directas a Supabase
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
