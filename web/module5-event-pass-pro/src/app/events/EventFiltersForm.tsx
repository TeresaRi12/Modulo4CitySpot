// =============================================================================
// COMPONENTE EVENT FILTERS FORM - Module 4: Event Pass
// =============================================================================
// Formulario de filtros que actualiza la URL.
//
// ## 'use client'
// Este componente es Client Component porque:
// 1. Usa useRouter para navegación programática
// 2. Maneja interactividad del formulario
//
// ## URL como estado
// En lugar de useState, guardamos los filtros en la URL.
// Ventajas:
// - Shareable (el link incluye los filtros)
// - Bookmarkable
// - Funciona con botón atrás del navegador
// - Server-side filtering (mejor performance)
// =============================================================================

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EVENT_CATEGORIES, CATEGORY_LABELS, type EventCategory } from '@/types/event';

interface EventFiltersFormProps {
  currentFilters: {
    search?: string;
    category?: EventCategory;
    status?: string;
    priceMax?: number;
  };
}

/**
 * Formulario de filtros de eventos.
 *
 * ## Patrón de URL State
 * Los filtros se guardan en la URL, no en estado local.
 * Cuando el usuario cambia un filtro, navegamos a la nueva URL.
 */
export function EventFiltersForm({ currentFilters }: EventFiltersFormProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Actualiza un filtro en la URL.
   */
  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      // Creamos nuevos searchParams
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Navegamos a la nueva URL
      router.push(`/events?${params.toString()}`);
    },
    [router, searchParams]
  );

  /**
   * Limpia todos los filtros.
   */
  const clearFilters = useCallback(() => {
    router.push('/events');
  }, [router]);

  /**
   * Handler para submit del formulario de búsqueda.
   */
  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    updateFilter('search', search || null);
  }

  const hasFilters =
    currentFilters.search || currentFilters.category || currentFilters.priceMax;

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Búsqueda */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Buscar eventos..."
            defaultValue={currentFilters.search}
            className="pl-9"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      {/* Filtros adicionales */}
      <div className="flex flex-wrap gap-4">
        {/* Categoría */}
        <Select
          value={currentFilters.category ?? 'all'}
          onValueChange={(value) => updateFilter('category', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {EVENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Precio máximo */}
        <Select
          value={currentFilters.priceMax?.toString() ?? 'all'}
          onValueChange={(value) => updateFilter('priceMax', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Precio máximo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquier precio</SelectItem>
            <SelectItem value="0">Gratis</SelectItem>
            <SelectItem value="25">Hasta 25€</SelectItem>
            <SelectItem value="50">Hasta 50€</SelectItem>
            <SelectItem value="100">Hasta 100€</SelectItem>
            <SelectItem value="200">Hasta 200€</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón limpiar */}
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
