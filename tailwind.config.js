/** @type {import('tailwindcss').Config} */
// Paleta extraída de la identidad visual del Dr. MediFit
// Logo "AD" con línea ECG: Navy profundo + Teal médico
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── TEAL — Acento principal (línea ECG del logo, íconos, CTAs) ──────────
        brand: {
          50:  '#d4f5f3',
          100: '#a8ece8',
          200: '#7de0db',
          300: '#4ecdc4',   // teal claro — highlights, glow
          400: '#3dbdb3',   // hover states
          500: '#2a9d8f',   // PRIMARY ACCENT ⭐ — logo ECG line, botones
          600: '#1a7a6e',   // teal oscuro — hover botones, table headers
          700: '#157a6e',
          800: '#0f5c52',
          900: '#093d37',
        },
        // ── NAVY — Fondo oscuro principal (letras del logo, sidebar, cards) ─────
        navy: {
          50:  '#e8edf3',
          100: '#c5d0dd',
          200: '#9fb0c4',
          300: '#7990aa',
          400: '#5a7491',
          500: '#3b5878',
          600: '#2a435f',   // navy medio
          700: '#1e3a5f',   // encabezados de tabla, card premium
          800: '#1a2a3a',   // sidebar, nav
          900: '#0d1b2a',   // fondo oscuro profundo — letras logo
        },
        // ── COLORES MÉDICOS (escala numérica para compatibilidad con componentes) ──
        // Mapeados al teal del doctor para mantener medical-500, medical-600, etc.
        medical: {
          50:  '#d4f5f3',   // teal muy claro — fondos suaves, badges
          100: '#a8ece8',   // teal claro — hover fondos
          200: '#7de0db',
          300: '#4ecdc4',   // teal light
          400: '#3dbdb3',   // hover
          500: '#2a9d8f',   // PRIMARY — equivale al brand-500
          600: '#1a7a6e',   // teal oscuro — borders activos, tabs
          700: '#157a6e',
          800: '#0f5c52',
          900: '#093d37',   // muy oscuro — texto fuerte sobre claro
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        script:  ['Dancing Script', 'cursive'],  // para tagline "Tu salud es el mejor proyecto"
      },
      boxShadow: {
        'teal-glow':  '0 0 20px rgba(42, 157, 143, 0.35)',
        'teal-sm':    '0 0 8px rgba(42, 157, 143, 0.25)',
        'navy-card':  '0 4px 24px rgba(13, 27, 42, 0.4)',
      },
      backgroundImage: {
        'teal-gradient':  'linear-gradient(135deg, #2a9d8f 0%, #4ecdc4 100%)',
        'navy-gradient':  'linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 100%)',
        'brand-gradient': 'linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 40%, #2a9d8f 100%)',
      },
    },
  },
  plugins: [],
}
