# Módulo 5 - EventPass Pro

## Gestión de Eventos con Firebase y Gemini AI

> Evolución de EventPass con autenticación, base de datos en la nube e inteligencia artificial.

---

## Descripción del Proyecto

**EventPass Pro** extiende Module 4 añadiendo servicios en la nube y generación de contenido con IA. Este proyecto enseña:

1. **Firebase Authentication** - Login con email/password y Google
2. **Firestore Database** - Base de datos NoSQL en tiempo real
3. **Gemini AI** - Generación de descripciones con IA generativa
4. **React Context** - Gestión de estado de autenticación

---

## Contexto Pedagógico

### 1. Firebase en Next.js

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FIREBASE EN NEXT.JS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   CLIENTE (Browser)                  │    SERVIDOR (Server Actions)      │
│   ──────────────────────────────────────────────────────────────────    │
│                                       │                                   │
│   firebase (SDK cliente)             │    firebase-admin (SDK admin)     │
│                                       │                                   │
│   ✅ Auth interactivo                │    ✅ Acceso privilegiado          │
│   ✅ Listeners tiempo real           │    ✅ Verificar tokens             │
│   ✅ Sign in con popup               │    ✅ Operaciones batch            │
│                                       │                                   │
│   Configuración:                     │    Configuración:                  │
│   NEXT_PUBLIC_FIREBASE_*             │    FIREBASE_ADMIN_*               │
│   (visibles en cliente)              │    (secretos, solo servidor)      │
│                                       │                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Firebase Authentication

```typescript
// AuthContext.tsx - Contexto de autenticación
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase notifica cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
```

### 3. Firestore Database

```typescript
// Estructura NoSQL
// Collection: events
// └── Document: eventId
//     ├── title: "Conferencia Web"
//     ├── description: "..."
//     ├── organizerId: "userId123"  // Referencia al usuario
//     └── createdAt: Timestamp

// Query con filtros
const events = await adminDb
  .collection('events')
  .where('status', '==', 'publicado')
  .orderBy('date', 'asc')
  .get();
```

### 4. Gemini AI Integration

```typescript
// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateEventDescription(input) {
  const client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Genera una descripción para: ${input.title}...`;
  const result = await model.generateContent(prompt);

  return result.response.text();
}
```

---

## Estructura del Proyecto

```
module5-event-pass-pro/
├── package.json                 # Firebase + Gemini dependencies
├── next.config.ts               # Configuración de Next.js
├── .env.example                 # Variables de entorno (Firebase + Gemini)
├── README.md                    # Esta documentación
└── src/
    ├── app/
    │   ├── layout.tsx           # + AuthProvider
    │   ├── page.tsx
    │   ├── auth/                # Página de login/registro
    │   │   └── page.tsx
    │   ├── api/                 # API Routes
    │   │   └── generate-description/
    │   │       └── route.ts     # Endpoint para Gemini
    │   └── events/
    │       └── ...
    ├── contexts/                # Contextos de React
    │   └── AuthContext.tsx      # Estado de autenticación
    ├── components/
    │   ├── auth/                # Componentes de autenticación
    │   │   ├── LoginForm.tsx
    │   │   └── UserMenu.tsx
    │   ├── ai/                  # Componentes de IA
    │   │   └── GenerateDescriptionButton.tsx
    │   └── ui/
    │       ├── avatar.tsx       # Nuevo
    │       └── dropdown-menu.tsx # Nuevo
    ├── lib/
    │   ├── firebase/            # Configuración Firebase
    │   │   ├── config.ts        # Cliente
    │   │   ├── admin.ts         # Admin (servidor)
    │   │   └── firestore.ts     # Data layer
    │   ├── gemini.ts            # Integración Gemini AI
    │   └── utils.ts
    └── types/
        └── event.ts             # + organizerId
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA EVENTPASS PRO                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   BROWSER                                                                │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  AuthProvider (React Context)                                   │   │
│   │  ┌─────────────────────────────────────────────────────────┐   │   │
│   │  │  Firebase Auth SDK (cliente)                            │   │   │
│   │  │  - signInWithEmailAndPassword()                         │   │   │
│   │  │  - signInWithPopup(GoogleProvider)                      │   │   │
│   │  │  - onAuthStateChanged()                                 │   │   │
│   │  └─────────────────────────────────────────────────────────┘   │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│   ════════════════════════════════│══════════════════════════════════   │
│                                   │                                      │
│   SERVER                          ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  ┌─────────────────┐    ┌─────────────────┐                    │   │
│   │  │  Server Actions │    │   API Routes    │                    │   │
│   │  │  CRUD eventos   │    │  /api/generate  │                    │   │
│   │  └────────┬────────┘    └────────┬────────┘                    │   │
│   │           │                      │                              │   │
│   │           ▼                      ▼                              │   │
│   │  ┌─────────────────┐    ┌─────────────────┐                    │   │
│   │  │ Firebase Admin  │    │   Gemini AI     │                    │   │
│   │  │  (Firestore)    │    │  (Generation)   │                    │   │
│   │  └─────────────────┘    └─────────────────┘                    │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Configuración de Firebase

### 1. Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Habilita Authentication (Email/Password + Google)
4. Crea una base de datos Firestore

### 2. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales
```

### 3. Credenciales de Admin

1. Firebase Console → Configuración → Cuentas de servicio
2. Genera nueva clave privada
3. Copia los valores a `FIREBASE_ADMIN_*`

---

## Configuración de Gemini AI

### 1. Obtener API Key

1. Ve a [Google AI Studio](https://aistudio.google.com)
2. Crea una API key
3. Copia a `GOOGLE_AI_API_KEY`

### 2. Uso en la Aplicación

El botón "Generar con IA" en el formulario de eventos usa Gemini para crear descripciones atractivas automáticamente.

---

## Configuración y Ejecución

### Prerrequisitos

- Node.js 20.19+ o 22.12+
- npm 10+
- Cuenta de Firebase
- Cuenta de Google AI Studio

### Instalación

```bash
# Navegar al directorio del módulo
cd web/module5-event-pass-pro

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales reales
```

### Comandos Disponibles

```bash
# Servidor de desarrollo con Turbopack
npm run dev

# Verificar tipos de TypeScript
npm run type-check

# Build de producción
npm run build

# Ejecutar versión de producción
npm start

# Ejecutar linter
npm run lint
```

---

## Características Nuevas vs Module 4

| Característica         | Module 4              | Module 5 (Pro)            |
| ---------------------- | --------------------- | ------------------------- |
| Almacenamiento         | Memoria (volátil)     | Firestore (persistente)   |
| Autenticación          | No                    | Firebase Auth             |
| Generación contenido   | Manual                | Gemini AI                 |
| Eventos por usuario    | No                    | Sí (organizerId)          |
| Login social           | No                    | Google OAuth              |

---

## Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FLUJO DE AUTENTICACIÓN                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. USUARIO HACE CLIC EN "INICIAR SESIÓN"                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  → Navega a /auth                                               │   │
│   │  → LoginForm muestra formulario                                 │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│   2. USUARIO INGRESA CREDENCIALES (o Google)                            │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  signInWithEmailAndPassword(auth, email, password)              │   │
│   │  // o signInWithPopup(auth, GoogleProvider)                     │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│   3. FIREBASE NOTIFICA CAMBIO DE ESTADO                                 │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  onAuthStateChanged(auth, (user) => {                           │   │
│   │    setUser(user);  // AuthContext se actualiza                  │   │
│   │  });                                                            │   │
│   └───────────────────────────────┬─────────────────────────────────┘   │
│                                   │                                      │
│   4. UI REACCIONA AUTOMÁTICAMENTE                                       │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  - Header muestra avatar del usuario                            │   │
│   │  - Botón "Crear Evento" usa organizerId                         │   │
│   │  - "Mis Eventos" filtra por usuario                             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Seguridad

### Reglas de Firestore (ejemplo)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      // Cualquiera puede leer eventos publicados
      allow read: if resource.data.status == 'publicado';

      // Solo el organizador puede modificar su evento
      allow write: if request.auth != null
        && request.auth.uid == resource.data.organizerId;
    }
  }
}
```

### Variables de Entorno

- `NEXT_PUBLIC_*`: Visibles en el cliente (no sensibles)
- `FIREBASE_ADMIN_*`: Solo servidor (secretos)
- `GOOGLE_AI_API_KEY`: Solo servidor (secreto)

---

## Experimentos Sugeridos

1. **Firestore Rules**: Implementa reglas de seguridad completas
2. **Realtime Updates**: Usa onSnapshot para actualizaciones en tiempo real
3. **Cloud Functions**: Envía emails cuando alguien se registra
4. **Storage**: Permite subir imágenes de eventos
5. **Analytics**: Integra Firebase Analytics

---

## Notas Educativas

### Client vs Server SDK

```typescript
// ❌ INCORRECTO: Usar firebase-admin en el cliente
import { adminDb } from '@/lib/firebase/admin';
// Expone credenciales del servidor

// ✅ CORRECTO: Usar firebase (cliente) en componentes 'use client'
import { auth } from '@/lib/firebase/config';

// ✅ CORRECTO: Usar firebase-admin solo en Server Actions/API Routes
// 'use server' o route.ts
import { adminDb } from '@/lib/firebase/admin';
```

### API Keys de IA

```typescript
// ❌ INCORRECTO: Llamar a Gemini desde el cliente
// Expone la API key

// ✅ CORRECTO: Usar una API Route
// Cliente → /api/generate-description → Gemini
```

---

## Licencia

Este proyecto es de uso educativo y fue creado como material de aprendizaje.

---

## Créditos

> Este proyecto ha sido generado usando Claude Code y adaptado con fines educativos por Adrián Catalán.
