// =============================================================================
// PÁGINA DE AUTENTICACIÓN - Module 5: EventPass Pro
// =============================================================================
// Página de login y registro.
// =============================================================================

import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

/**
 * Metadata de la página.
 */
export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Accede a tu cuenta de EventPass Pro',
};

/**
 * Página de autenticación.
 */
export default function AuthPage(): React.ReactElement {
  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-8">
      <LoginForm />
    </div>
  );
}
