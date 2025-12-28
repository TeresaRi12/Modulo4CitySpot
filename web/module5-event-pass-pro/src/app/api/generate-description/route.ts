// =============================================================================
// API ROUTE: GENERAR DESCRIPCIÓN - Module 5: EventPass Pro
// =============================================================================
// API Route para generar descripciones con Gemini AI.
//
// ## ¿Por qué una API Route?
// - La API key de Gemini debe permanecer en el servidor
// - Las API Routes se ejecutan solo en el servidor
// - Podemos añadir rate limiting, logging, etc.
//
// ## Route Handlers en App Router
// Exportamos funciones nombradas según el método HTTP: GET, POST, PUT, DELETE
// =============================================================================

import { NextResponse } from 'next/server';
import { generateEventDescription } from '@/lib/gemini';
import { CATEGORY_LABELS, type EventCategory } from '@/types/event';

/**
 * POST /api/generate-description
 *
 * Genera una descripción de evento usando Gemini AI.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Parseamos el body
    const body = await request.json();
    const { title, category, location, date } = body;

    // Validación básica
    if (!title || !category || !location || !date) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: title, category, location, date' },
        { status: 400 }
      );
    }

    // Formateamos la fecha para el prompt
    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Traducimos la categoría
    const categoryLabel = CATEGORY_LABELS[category as EventCategory] ?? category;

    // Generamos la descripción
    const description = await generateEventDescription({
      title,
      category: categoryLabel,
      location,
      date: formattedDate,
    });

    if (!description) {
      return NextResponse.json(
        { error: 'No se pudo generar la descripción. Verifica la configuración de Gemini AI.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error en /api/generate-description:', error);

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
