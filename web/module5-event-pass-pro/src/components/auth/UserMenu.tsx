// =============================================================================
// COMPONENTE USER MENU - Module 5: EventPass Pro
// =============================================================================
// Menú de usuario en el header con avatar y opciones.
// =============================================================================

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Calendar, Plus } from 'lucide-react';

/**
 * Menú de usuario o botón de login.
 *
 * ## Estados
 * - Si hay usuario: Muestra avatar con dropdown
 * - Si no hay usuario: Muestra botón de login
 */
export function UserMenu(): React.ReactElement {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // Loading state
  if (loading) {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
    );
  }

  // No user - show login button
  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/auth">Iniciar Sesión</Link>
      </Button>
    );
  }

  // User logged in - show menu
  const initials = user.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() ?? 'U';

  async function handleSignOut(): Promise<void> {
    try {
      await signOut();
      router.push('/');
    } catch {
      // Error handled in context
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'Avatar'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName ?? 'Usuario'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/events/new" className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Crear evento
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/my-events" className="cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            Mis eventos
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Mi perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
