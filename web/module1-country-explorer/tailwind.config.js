// =============================================================================
// TAILWIND CSS CONFIGURATION - Module 1: Country Explorer
// =============================================================================
// Este archivo configura Tailwind CSS para el proyecto.
//
// ## ¿Qué es Tailwind CSS?
// Tailwind es un framework CSS "utility-first" que proporciona clases
// pequeñas y reutilizables (como flex, pt-4, text-center) en lugar de
// componentes predefinidos.
//
// ## content
// Le dice a Tailwind dónde buscar clases para incluir en el CSS final.
// Solo las clases que encuentre en estos archivos se incluirán (tree-shaking).
// =============================================================================

/** @type {import('tailwindcss').Config} */
export default {
  // =========================================================================
  // CONTENT - Archivos a escanear
  // =========================================================================
  // Tailwind analiza estos archivos para detectar qué clases se usan.
  // Las clases no utilizadas se eliminan del CSS final (purging).
  // =========================================================================
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // =========================================================================
  // THEME - Personalización del diseño
  // =========================================================================
  // Aquí podemos extender o sobrescribir el tema por defecto de Tailwind.
  // Por ahora usamos la configuración por defecto.
  // =========================================================================
  theme: {
    extend: {
      // Podríamos añadir colores personalizados, fuentes, etc.
      // colors: {
      //   'brand': '#3B82F6',
      // },
    },
  },

  // =========================================================================
  // PLUGINS - Extensiones de funcionalidad
  // =========================================================================
  // Los plugins añaden utilidades adicionales a Tailwind.
  // Por ahora no necesitamos ninguno.
  // =========================================================================
  plugins: [],
};
