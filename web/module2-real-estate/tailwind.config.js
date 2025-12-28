// =============================================================================
// TAILWIND CSS CONFIGURATION - Module 2: Real Estate React
// =============================================================================
// Configuración de Tailwind CSS optimizada para Shadcn UI.
//
// ## Shadcn UI y Tailwind
// Shadcn UI no es una librería de componentes tradicional. En lugar de
// instalar componentes como paquetes npm, los copias directamente a tu
// proyecto. Esto te da control total sobre el código y los estilos.
// =============================================================================

/** @type {import('tailwindcss').Config} */
export default {
  // =========================================================================
  // DARK MODE
  // =========================================================================
  // Usamos 'class' para controlar el modo oscuro con una clase CSS.
  // Esto permite cambiar el tema programáticamente con JavaScript.
  // =========================================================================
  darkMode: ['class'],

  // Archivos a escanear para detectar clases utilizadas
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // =========================================================================
  // THEME
  // =========================================================================
  // Extendemos el tema de Tailwind con variables CSS personalizadas.
  // Shadcn UI usa estas variables para sus componentes.
  // =========================================================================
  theme: {
    extend: {
      // Colores usando variables CSS (definidas en globals.css)
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      // Border radius usando variable CSS
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Animaciones para componentes interactivos
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  // Plugin para animaciones adicionales
  plugins: [require('tailwindcss-animate')],
};
