# 🏥 Identidad Visual — Dr. MediFit

## Información del Doctor

| Campo | Valor |
|:---|:---|
| **Nombre** | Dr. MediFit |
| **Especialidad** | Médico Cirujano |
| **Cédula** | 15816552 |
| **Contacto** | 229 519 1262 |
| **Lema / Tagline** | *"Tu salud es el mejor proyecto"* |
| **Slogan secundario** | *"Disciplina hoy, resultados mañana."* |

---

## 🎨 Paleta de Colores Extraída

### Colores Principales

| Nombre | Hex | Rol | Aparece en |
|:---|:---|:---|:---|
| **Navy Deep** | `#0d1b2a` | Fondo oscuro / texto principal | Logo (letras A/D), shirt |
| **Teal Primary** | `#2a9d8f` | Acento principal / línea de pulso | Logo (ECG line), shirt stripes, iconos publicidad |
| **Teal Dark** | `#1a7a6e` | Hover / énfasis teal oscuro | Tablas encabezado, botones CTA |
| **Teal Light** | `#4ecdc4` | Highlight / glow effect | Detalles camisa, acentos UI |
| **Off-White** | `#f7f9fc` | Fondo claro / fondos de tarjetas | Fondo publicidad |
| **Slate Blue** | `#1e3a5f` | Encabezados tabla, tarjeta premium | Plan "Presencial + Entrenamiento" |
| **Ice Blue** | `#e8f6f8` | Fondo de secciones suaves | Fondos alternos publicidad |

### Colores Secundarios / Estado

| Nombre | Hex | Rol |
|:---|:---|:---|
| **Success / Check** | `#2a9d8f` | Íconos de check, adherencia |
| **Alert Red** | `#e63946` | Banners "NO HAY CUPO", alertas |
| **Dark BG** | `#111827` | Modo oscuro (shirt/gym theme) |
| **White Text** | `#ffffff` | Texto sobre fondos oscuros |
| **Body Text** | `#2d3748` | Texto cuerpo en fondos claros |
| **Muted Text** | `#718096` | Subtítulos, labels |

---

## 🖋️ Tipografía Identificada

| Rol | Fuente Inferida | Características |
|:---|:---|:---|
| **Logo / Marca** | Serif elegante con rasgos geométricos | Letras "AD" bold, mayúsculas, tracking amplio |
| **Headings principales** | Sans-serif bold/black | "PROGRAMA INTEGRAL DE SALUD", "DIETA MENSUAL" — muy bold |
| **Body / Subtítulos** | Sans-serif regular | Texto de tabla, descripciones — limpio y legible |
| **Tagline / Cursiva** | Script / Italic | *"Tu salud es el mejor proyecto"* — estilo handwriting |

**Recomendación de Google Fonts:**
- **Display (Headings)**: `Plus Jakarta Sans` (700–800 weight) ✅ ya en uso
- **Body**: `Inter` (400–500 weight) ✅ ya en uso  
- **Tagline cursiva**: `Dancing Script` o `Pacifico` para el slogan

---

## 🧬 Concepto e Identidad de Marca

### Concepto Central
El **"AD"** (iniciales del doctor) combina dos elementos:
1. **Letras tipográficas clásicas** — transmite profesionalismo y autoridad médica
2. **Línea de electrocardiograma (ECG/pulso)** que atraviesa ambas letras — representa vida, salud, monitoreo médico

> **Metáfora visual**: *"Cada paciente tiene un ritmo vital que el doctor monitorea y cuida"*

### Valores de Marca Transmitidos
- 🏋️ **Performance / Resultados** — No es medicina pasiva, es activa y transformadora
- 🩺 **Credibilidad Clínica** — Cédula profesional, enfoque médico-científico
- 🌿 **Bienestar Integral** — Nutrición + entrenamiento + seguimiento médico en un solo programa
- 💎 **Exclusividad** — Planes premium, cupo limitado ("NO HAY CUPO")
- ⚡ **Disciplina / Acción** — *"Disciplina hoy, resultados mañana"*

---

## 🎯 Planes de Servicio del Doctor

| Plan | Precio | Modalidad |
|:---|:---|:---|
| **En Línea** | $500/mes | Digital (WhatsApp / plataforma) |
| **Presencial** | $750/mes | Consultorio |
| **Presencial + Entrenamiento** | $1,300/mes | Premium (cupo limitado) |

### Incluye en todos los planes:
- Plan de alimentación personalizado
- Seguimiento nutricional individualizado
- Control de adherencia semanal
- Plan de entrenamiento personalizado

---

## 🖥️ Directrices UI para la Plataforma

### Modo de Diseño
**Dark Premium con acentos Teal** — Inspirado en la camisa deportiva y el ecosistema visual del doctor:
- Fondos oscuros (`#0d1b2a`, `#111827`) con glassmorphism
- Acentos en teal (`#2a9d8f`) para CTAs, highlights y la línea ECG decorativa
- Cards con borders teal sutiles y glow effects

### Variables CSS / Tokens a Implementar

```css
/* BRAND TOKENS — Dr. MediFit */
--color-navy-900: #0d1b2a;      /* Fondo principal oscuro */
--color-navy-800: #1a2a3a;      /* Sidebar, nav */
--color-navy-700: #1e3a5f;      /* Cards elevadas */
--color-teal-600: #1a7a6e;      /* Teal oscuro */
--color-teal-500: #2a9d8f;      /* PRIMARY ACCENT ⭐ */
--color-teal-400: #3dbdb3;      /* Hover states */
--color-teal-300: #4ecdc4;      /* Highlights, glow */
--color-teal-100: #d4f5f3;      /* Teal suave para badges */
--color-off-white: #f7f9fc;     /* Texto claro */
--color-muted: #94a3b8;         /* Subtítulos */
--color-danger: #e63946;        /* Alertas */
```

### Tailwind Config — Paleta Nueva

```js
colors: {
  brand: {
    50:  '#d4f5f3',
    100: '#a8ece8',
    200: '#7de0db',
    300: '#4ecdc4',   // teal-light
    400: '#3dbdb3',   // teal-hover
    500: '#2a9d8f',   // PRIMARY ⭐
    600: '#1a7a6e',   // teal-dark
    700: '#1e3a5f',   // navy-medium
    800: '#1a2a3a',   // navy-dark
    900: '#0d1b2a',   // navy-deep
  }
}
```

### Elementos UI Inspirados en la Marca

| Elemento | Estilo Recomendado |
|:---|:---|
| **Logo en UI** | Mostrar "AD" con línea ECG animada en teal |
| **Sidebar** | Dark navy `#1a2a3a` con acento teal en ítem activo |
| **Cards** | `bg-white/5` glassmorphism + border `teal-500/20` |
| **Botones primarios** | `bg-teal-500` → hover `bg-teal-400` + sombra teal glow |
| **Tablas de dieta** | Header `bg-navy-700`, filas alternas `bg-teal-50` |
| **Progress bars** | Gradiente `teal-300` → `teal-500` |
| **Badges de plan** | "En Línea" = teal suave, "Presencial" = navy, "Premium" = gold gradient |
| **Línea decorativa ECG** | SVG animado en color teal traversando headers |

---

## 📁 Archivos de Referencia

| Archivo | Contenido |
|:---|:---|
| [`logo.jpeg`](file:///home/isaac/antigravity/valiant-davinci/reference/logo.jpeg) | Logo oficial "AD" con línea ECG |
| [`publicidad-1.jpeg`](file:///home/isaac/antigravity/valiant-davinci/reference/publicidad-1.jpeg) | Infografía completa de planes (todos con cupo) |
| [`publicidad-2.jpeg`](file:///home/isaac/antigravity/valiant-davinci/reference/publicidad-2.jpeg) | Infografía con banner "NO HAY CUPO" en plan premium |
| [`plan-paciente-1.jpeg`](file:///home/isaac/antigravity/valiant-davinci/reference/plan-paciente-1.jpeg) | Dieta mensual — Alondra Rivera (joven, déficit) |
| [`plan-paciente-2.jpeg`](file:///home/isaac/antigravity/valiant-davinci/reference/plan-paciente-2.jpeg) | Dieta mensual — Manuel Rojas (obesidad grado II, DASH) |
| [`shirt.jpeg`](file:///home/isaac/antigravity/valiant-davinci/reference/shirt.jpeg) | Merchandising: camisa negra con logo teal — dark mode ref |
