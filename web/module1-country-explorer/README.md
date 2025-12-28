# Módulo 1 - Country Explorer

## Fundamentos de Desarrollo Web con TypeScript

> Buscador de información turística de países usando TypeScript vanilla, HTML5 y Tailwind CSS 4.

---

## Descripción del Proyecto

**Country Explorer** es una aplicación web educativa que permite buscar y explorar información detallada de cualquier país del mundo. El proyecto está diseñado para enseñar los fundamentos del desarrollo web moderno **sin utilizar frameworks** como React o Vue, enfocándose en:

1. **Manipulación directa del DOM** con la API nativa del navegador
2. **Programación asíncrona** con Fetch API y async/await
3. **TypeScript estricto** con tipado fuerte comparable a Kotlin

---

## Capturas de Pantalla

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🌍 Explorador de Países                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  🔍 Buscar país (ej: España, México, Argentina...)         [Buscar]  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │   🇪🇸 España  │  │   🇲🇽 México  │  │  🇦🇷 Argentina│                       │
│  │              │  │              │  │              │                       │
│  │  Capital:    │  │  Capital:    │  │  Capital:    │                       │
│  │  Madrid      │  │  México D.F. │  │  Buenos Aires│                       │
│  │              │  │              │  │              │                       │
│  │  Población:  │  │  Población:  │  │  Población:  │                       │
│  │  47.3M       │  │  128.9M      │  │  45.3M       │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Contexto Pedagógico

Este módulo cubre los siguientes conceptos fundamentales:

### 1. HTML5 Semántico y Tailwind CSS 4

```html
<!-- Estructura semántica correcta -->
<header>...</header>
<main>
  <section>...</section>
</main>
<footer>...</footer>
```

- **Tailwind CSS 4**: Nueva sintaxis con `@import 'tailwindcss'`
- **Clases utilitarias**: Estilos inline sin CSS separado
- **Responsive design**: Prefijos como `md:`, `lg:`

### 2. JavaScript Asíncrono y Fetch API

```typescript
// Entendiendo el Event Loop y las Promesas
async function searchCountries(name: string): Promise<Country[]> {
  const response = await fetch(`${BASE_URL}/name/${name}`);

  if (!response.ok) {
    throw new ApiError('Error del servidor');
  }

  return (await response.json()) as Country[];
}
```

- **async/await**: Sintaxis moderna para código asíncrono
- **Fetch API**: API nativa para peticiones HTTP
- **Error handling**: Manejo correcto de errores de red

### 3. TypeScript Estricto

```typescript
// Interfaces tipadas (equivalente a data class en Kotlin)
interface Country {
  name: CountryName;
  capital?: string[]; // Opcional con ?
  population: number;
  flags: CountryFlags;
}

// Union types para estados
type UiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Country[] }
  | { status: 'error'; message: string };
```

---

## Estructura del Proyecto

```
module1-country-explorer/
├── index.html                 # Punto de entrada HTML
├── package.json               # Dependencias y scripts
├── tsconfig.json              # Configuración TypeScript estricta
├── vite.config.ts             # Configuración de Vite
├── eslint.config.js           # Reglas de linting
├── postcss.config.js          # Procesamiento CSS
├── .prettierrc                # Formato de código
├── .gitignore                 # Archivos ignorados
├── README.md                  # Esta documentación
├── TECH_STACK.md              # Versiones de dependencias
└── src/
    ├── main.ts                # Punto de entrada TypeScript
    ├── styles/
    │   └── main.css           # Estilos con Tailwind
    ├── types/
    │   └── country.ts         # Definiciones de tipos
    ├── services/
    │   └── countryApi.ts      # Comunicación con la API
    ├── components/
    │   ├── CountryCard.ts     # Componente de tarjeta
    │   └── CountryModal.ts    # Componente de modal
    └── utils/
        ├── dom.ts             # Utilidades del DOM
        └── format.ts          # Formateo de datos
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARQUITECTURA                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌────────────┐                                                           │
│    │   Usuario  │                                                           │
│    └─────┬──────┘                                                           │
│          │ Interacción (click, input)                                       │
│          ▼                                                                   │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │                          main.ts                                    │  │
│    │                    (Punto de Entrada)                               │  │
│    │                                                                     │  │
│    │  • Inicializa la aplicación                                        │  │
│    │  • Gestiona el estado (UiState)                                    │  │
│    │  • Conecta eventos con acciones                                     │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
│          │                    │                     │                        │
│          ▼                    ▼                     ▼                        │
│    ┌───────────┐        ┌───────────┐         ┌───────────┐                 │
│    │ services/ │        │components/│         │  utils/   │                 │
│    │           │        │           │         │           │                 │
│    │countryApi │        │CountryCard│         │   dom.ts  │                 │
│    │   .ts     │        │   .ts     │         │format.ts  │                 │
│    └─────┬─────┘        └───────────┘         └───────────┘                 │
│          │                                                                   │
│          ▼                                                                   │
│    ┌───────────────────────────────────────────────────────────────────┐    │
│    │                    REST Countries API                              │    │
│    │                 https://restcountries.com                          │    │
│    └───────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Conceptos Clave Implementados

### Patrón de Estado (UiState)

Similar al patrón `sealed class` en Kotlin:

```typescript
// TypeScript
type UiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Country[] }
  | { status: 'error'; message: string };

// Equivalente en Kotlin
sealed class UiState {
  object Idle : UiState()
  object Loading : UiState()
  data class Success(val data: List<Country>) : UiState()
  data class Error(val message: String) : UiState()
}
```

### Manipulación del DOM sin Virtual DOM

```typescript
// Creamos elementos de forma imperativa
function createCountryCard(country: Country): HTMLElement {
  const card = document.createElement('article');
  card.className = 'country-card';
  card.innerHTML = `...`;
  return card;
}

// vs React (declarativo)
function CountryCard({ country }) {
  return <article className="country-card">...</article>;
}
```

### Debounce para Optimización

```typescript
// Evita llamadas excesivas a la API mientras el usuario escribe
const debouncedSearch = debounce(() => {
  void handleSearch();
}, 400);

input.addEventListener('input', debouncedSearch);
```

---

## Configuración y Ejecución

### Prerrequisitos

- Node.js 20.19+ o 22.12+
- npm 10+

### Instalación

```bash
# Navegar al directorio del módulo
cd web/module1-country-explorer

# Instalar dependencias
npm install
```

### Comandos Disponibles

```bash
# Servidor de desarrollo (puerto 3000)
npm run dev

# Verificar tipos de TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Formatear código
npm run format

# Build de producción
npm run build

# Previsualizar build de producción
npm run preview
```

---

## Notas Educativas

### Comparación: DOM API vs Frameworks

| Aspecto            | DOM API (este proyecto)  | React/Vue                 |
| ------------------ | ------------------------ | ------------------------- |
| Curva aprendizaje  | Entiende el fundamento   | Abstracción del DOM       |
| Rendimiento        | Control manual           | Virtual DOM optimizado    |
| Código reutilizable| Funciones factory        | Componentes declarativos  |
| Estado             | Variables globales       | Gestión integrada         |
| Escalabilidad      | Limitada                 | Excelente                 |

### ¿Por qué aprender esto primero?

1. **Fundamento sólido**: Entender cómo funciona el navegador
2. **Depuración**: Saber qué hace React "por debajo"
3. **Decisiones informadas**: Elegir cuándo usar o no un framework
4. **Proyectos pequeños**: A veces un framework es excesivo

---

## Experimentos Sugeridos

1. **Agregar filtros**: Implementa filtros por región o población
2. **Modo oscuro/claro**: Añade un toggle de tema
3. **Favoritos**: Guarda países favoritos en localStorage
4. **Comparación**: Permite comparar dos países lado a lado
5. **Caché**: Implementa caché de búsquedas para reducir peticiones

---

## API Utilizada

**REST Countries API v3.1**
- Documentación: https://restcountries.com
- Endpoint principal: `https://restcountries.com/v3.1/name/{nombre}`
- Sin autenticación requerida
- Límite de requests: Sin límite documentado

---

## Licencia

Este proyecto es de uso educativo y fue creado como material de aprendizaje.

---

## Créditos

> Este proyecto ha sido generado usando Claude Code y adaptado con fines educativos por Adrián Catalán.
