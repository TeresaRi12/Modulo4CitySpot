# Módulo 3 - RealEstate Hub API

## Backend API con Node.js, Express y Prisma

> API REST para el portal inmobiliario usando Express, Prisma ORM y SQLite.

---

## Descripción del Proyecto

**RealEstate Hub API** es el backend que sirve los datos para el portal inmobiliario del Módulo 2. Este proyecto enseña:

1. **Node.js y Express** - Creación de servidores HTTP y APIs REST
2. **Prisma ORM** - Modelado de datos type-safe similar a Room en Android
3. **Controladores y Middlewares** - Separación de responsabilidades
4. **Validación con Zod** - Esquemas compartidos entre frontend y backend

---

## Contexto Pedagógico

### 1. Node.js y Express Básicos

```typescript
// Creación del servidor Express
import express from 'express';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Definición de rutas
app.get('/api/properties', (req, res) => {
  // Lógica del endpoint
});

app.listen(3002, () => {
  console.log('Servidor corriendo en puerto 3002');
});
```

### 2. Prisma ORM (Paridad con Room/DAO)

```prisma
// schema.prisma - Similar a Entity en Room
model Property {
  id          String   @id @default(cuid())
  title       String
  price       Float
  createdAt   DateTime @default(now())

  @@map("properties")  // Nombre de tabla
}
```

```typescript
// Uso del cliente Prisma - Similar a DAO
const properties = await prisma.property.findMany({
  where: { city: 'Madrid' },
  orderBy: { createdAt: 'desc' }
});
```

### 3. Controladores y Middlewares

```typescript
// Middleware - Se ejecuta antes de los controladores
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pasa al siguiente middleware/controlador
});

// Controlador - Contiene la lógica de negocio
export async function getAllProperties(req, res) {
  const properties = await prisma.property.findMany();
  res.json({ success: true, data: properties });
}
```

---

## Estructura del Proyecto

```
module3-realestate-hub-api/
├── package.json               # Dependencias y scripts
├── tsconfig.json              # Configuración TypeScript
├── eslint.config.js           # Reglas de linting
├── .prettierrc                # Formato de código
├── .gitignore                 # Archivos ignorados
├── API_CONTRACT.md            # Documentación de endpoints
├── README.md                  # Esta documentación
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Datos de ejemplo
│   └── dev.db                 # Base de datos SQLite (generada)
└── src/
    ├── server.ts              # Punto de entrada
    ├── types/
    │   └── property.ts        # Tipos compartidos con Module 2
    ├── controllers/
    │   └── propertyController.ts  # Lógica de negocio
    ├── routes/
    │   └── propertyRoutes.ts  # Definición de endpoints
    └── middlewares/
        └── errorHandler.ts    # Manejo de errores
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARQUITECTURA                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │                         HTTP Request                                 │  │
│    │                    (GET /api/properties)                            │  │
│    └───────────────────────────────┬─────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │                       MIDDLEWARES                                    │  │
│    │           cors() → json() → logger → routes                         │  │
│    └───────────────────────────────┬─────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │                         ROUTES                                       │  │
│    │   GET /api/properties → getAllProperties()                          │  │
│    │   POST /api/properties → createProperty()                           │  │
│    └───────────────────────────────┬─────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │                      CONTROLLERS                                     │  │
│    │   1. Validar entrada (Zod)                                          │  │
│    │   2. Ejecutar lógica de negocio                                     │  │
│    │   3. Interactuar con la base de datos                               │  │
│    │   4. Formatear respuesta                                            │  │
│    └───────────────────────────────┬─────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │                      PRISMA CLIENT                                   │  │
│    │         Type-safe queries → SQLite Database                         │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Comparación: Prisma vs Room (Android)

| Concepto        | Prisma (Node.js)              | Room (Android)              |
| --------------- | ----------------------------- | --------------------------- |
| Esquema         | schema.prisma                 | @Entity classes             |
| Cliente         | PrismaClient                  | RoomDatabase                |
| Queries         | prisma.model.findMany()       | @Query en DAO               |
| Migraciones     | prisma migrate                | Room auto-migration         |
| Tipos           | Generados automáticamente     | Generados por KAPT/KSP      |

---

## Configuración y Ejecución

### Prerrequisitos

- Node.js 20.19+ o 22.12+
- npm 10+

### Instalación

```bash
# Navegar al directorio del módulo
cd web/module3-realestate-hub-api

# Instalar dependencias
npm install

# Generar cliente Prisma
npm run db:generate

# Crear base de datos y aplicar esquema
npm run db:push

# Sembrar datos de ejemplo
npm run db:seed
```

### Comandos Disponibles

```bash
# Servidor de desarrollo con hot-reload
npm run dev

# Verificar tipos de TypeScript
npm run type-check

# Build de producción
npm run build

# Ejecutar versión de producción
npm start

# Abrir Prisma Studio (GUI para la DB)
npm run db:studio

# Ejecutar linter
npm run lint
```

---

## Endpoints de la API

| Método | Endpoint               | Descripción                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | /health                | Health check                   |
| GET    | /api/properties        | Listar propiedades (con filtros)|
| GET    | /api/properties/:id    | Obtener propiedad por ID       |
| POST   | /api/properties        | Crear nueva propiedad          |
| PUT    | /api/properties/:id    | Actualizar propiedad           |
| DELETE | /api/properties/:id    | Eliminar propiedad             |

Ver [API_CONTRACT.md](./API_CONTRACT.md) para documentación detallada.

---

## Notas Educativas

### REST vs otros estilos de API

| Estilo    | Características                              | Uso típico          |
| --------- | -------------------------------------------- | ------------------- |
| REST      | Recursos + verbos HTTP, stateless            | APIs públicas       |
| GraphQL   | Query language, un endpoint                  | Apps complejas      |
| gRPC      | Binary protocol, contracts                   | Microservicios      |

### Middleware en Express

```typescript
// Los middlewares se ejecutan en orden de declaración
app.use(cors());        // 1. Habilitar CORS
app.use(express.json());// 2. Parsear JSON
app.use(logger);        // 3. Logging
app.use('/api', routes);// 4. Rutas
app.use(errorHandler);  // 5. Manejo de errores (siempre al final)
```

---

## Experimentos Sugeridos

1. **Paginación**: Implementa limit/offset para listados grandes
2. **Autenticación**: Añade JWT para proteger endpoints
3. **Rate Limiting**: Limita peticiones por IP
4. **Caching**: Implementa caché con Redis
5. **Búsqueda avanzada**: Usa full-text search de SQLite

---

## Conectar con Module 2

Para usar esta API desde el frontend de Module 2, actualiza el archivo `storage.ts`:

```typescript
// Antes (localStorage)
export function getAllProperties(): Property[] {
  const data = localStorage.getItem('properties');
  return data ? JSON.parse(data) : [];
}

// Después (API)
export async function getAllProperties(): Promise<Property[]> {
  const response = await fetch('http://localhost:3002/api/properties');
  const data = await response.json();
  return data.data;
}
```

---

## Licencia

Este proyecto es de uso educativo y fue creado como material de aprendizaje.

---

## Créditos

> Este proyecto ha sido generado usando Claude Code y adaptado con fines educativos por Adrián Catalán.
