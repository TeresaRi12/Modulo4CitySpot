// =============================================================================
// COMPONENTE HEADER - Module 4: Event Pass
// =============================================================================
// Header de navegación de la aplicación.
// =============================================================================

import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Header de navegación principal.
 *
 * ## Server Component
 * Este es un Server Component porque no tiene interactividad
 * que requiera JavaScript del cliente.
 */
export function Header(): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo y nombre */}
        <Link href="/" className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">EventPass</span>
        </Link>

        {/* Navegación */}
        <nav className="flex items-center gap-4">
          <Link href="/events" className="text-sm font-medium hover:text-primary">
            Eventos
          </Link>
          <Button asChild size="sm">
            <Link href="/events/new" className="gap-1">
              <Plus className="h-4 w-4" />
              Crear Evento
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
