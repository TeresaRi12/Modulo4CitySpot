// =============================================================================
// CONTEXTO DE AUTENTICACIÓN - Module 5: EventPass Pro
// =============================================================================
// Contexto de React que maneja el estado de autenticación.
//
// ## ¿Por qué un Context?
// El estado de autenticación se necesita en muchos componentes:
// - Header (mostrar usuario logueado)
// - Formularios (asociar eventos al usuario)
// - Páginas protegidas
//
// ## Firebase Auth + React Context
// Firebase maneja la autenticación real.
// React Context distribuye el estado a toda la app.
//
// ## Build Time Safety
// Durante el build, Firebase puede no estar inicializado.
// Usamos getFirebaseAuth() para inicialización lazy.
// =============================================================================

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User,
  type Auth,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';

// =============================================================================
// TIPOS
// =============================================================================

/**
 * Usuario autenticado simplificado.
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Estado y métodos del contexto de auth.
 */
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// =============================================================================
// CONTEXTO
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Convierte un User de Firebase a nuestro tipo AuthUser.
 */
function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

/**
 * Provider de autenticación.
 *
 * ## onAuthStateChanged
 * Firebase proporciona un observer que se ejecuta cuando:
 * 1. El usuario inicia sesión
 * 2. El usuario cierra sesión
 * 3. Al cargar la página (si hay sesión guardada)
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Inicializa Firebase Auth en el cliente
  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    setAuth(firebaseAuth);
    setIsConfigured(firebaseAuth !== null);

    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(toAuthUser(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Inicio de sesión con email y contraseña.
   */
  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    if (!auth) {
      setError('Firebase no está configurado');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(translateFirebaseError(message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  /**
   * Registro con email y contraseña.
   */
  const signUp = useCallback(
    async (email: string, password: string, displayName: string): Promise<void> => {
      if (!auth) {
        setError('Firebase no está configurado');
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

        // Actualizamos el nombre del usuario
        await updateProfile(newUser, { displayName });
        setUser(toAuthUser(newUser));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al registrarse';
        setError(translateFirebaseError(message));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  /**
   * Inicio de sesión con Google.
   */
  const signInWithGoogle = useCallback(async (): Promise<void> => {
    if (!auth) {
      setError('Firebase no está configurado');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión con Google';
      setError(translateFirebaseError(message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  /**
   * Cierre de sesión.
   */
  const signOut = useCallback(async (): Promise<void> => {
    if (!auth) {
      return;
    }

    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(message);
      throw err;
    }
  }, [auth]);

  /**
   * Limpia el error actual.
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    isConfigured,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook para acceder al contexto de autenticación.
 *
 * @example
 * const { user, signIn, signOut } = useAuth();
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}

// =============================================================================
// UTILIDADES
// =============================================================================

/**
 * Traduce errores de Firebase a mensajes amigables en español.
 */
function translateFirebaseError(message: string): string {
  const translations: Record<string, string> = {
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/popup-closed-by-user': 'Se cerró la ventana de autenticación',
  };

  // Buscamos el código de error en el mensaje
  for (const [code, translation] of Object.entries(translations)) {
    if (message.includes(code)) {
      return translation;
    }
  }

  return message;
}
