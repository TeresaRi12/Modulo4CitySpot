// =============================================================================
// FIRESTORE DATA LAYER - Module 5: EventPass Pro
// =============================================================================
// Funciones para interactuar con Firestore desde el servidor.
//
// ## Arquitectura
// Este módulo reemplaza el almacén en memoria de Module 4.
// Las funciones son similares pero ahora usan Firestore.
//
// ## Firebase Admin SDK
// El Admin SDK tiene una API diferente al SDK del cliente:
// - adminDb.collection('events').doc(id).get()
// - No usa funciones standalone como el cliente
//
// ## Colecciones
// - events: Almacena los eventos
// =============================================================================

import { adminDb } from './admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { Event, EventFilters, CreateEventInput } from '@/types/event';

// Nombre de la colección
const EVENTS_COLLECTION = 'events';

/**
 * Convierte un documento de Firestore a tipo Event.
 *
 * ## Timestamps
 * Firestore usa su propio tipo Timestamp.
 * Lo convertimos a ISO string para consistencia.
 */
function docToEvent(docId: string, data: FirebaseFirestore.DocumentData): Event {
  return {
    id: docId,
    title: data.title,
    description: data.description,
    category: data.category,
    status: data.status,
    date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
    endDate: data.endDate
      ? data.endDate instanceof Timestamp
        ? data.endDate.toDate().toISOString()
        : data.endDate
      : undefined,
    location: data.location,
    address: data.address,
    capacity: data.capacity,
    registeredCount: data.registeredCount ?? 0,
    price: data.price,
    imageUrl: data.imageUrl,
    organizerName: data.organizerName,
    organizerEmail: data.organizerEmail,
    organizerId: data.organizerId,
    tags: data.tags ?? [],
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt,
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt,
  };
}

/**
 * Obtiene todos los eventos con filtros opcionales.
 */
export async function getEvents(filters?: EventFilters): Promise<Event[]> {
  let query: FirebaseFirestore.Query = adminDb.collection(EVENTS_COLLECTION);

  // Aplicamos filtros en orden (Firestore requiere índices para queries compuestas)
  query = query.orderBy('date', 'asc');

  // Filtro por estado
  if (filters?.status) {
    query = query.where('status', '==', filters.status);
  }

  // Filtro por categoría
  if (filters?.category) {
    query = query.where('category', '==', filters.category);
  }

  // Ejecutamos la query
  const snapshot = await query.get();

  let events = snapshot.docs.map((doc) => docToEvent(doc.id, doc.data()));

  // Filtros que aplicamos en memoria (Firestore no soporta búsqueda de texto)
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    events = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
    );
  }

  // Filtro por precio máximo
  if (filters?.priceMax !== undefined) {
    events = events.filter((event) => event.price <= filters.priceMax!);
  }

  return events;
}

/**
 * Obtiene un evento por su ID.
 */
export async function getEventById(id: string): Promise<Event | null> {
  const docRef = adminDb.collection(EVENTS_COLLECTION).doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  return docToEvent(docSnap.id, docSnap.data()!);
}

/**
 * Crea un nuevo evento.
 */
export async function createEvent(
  data: CreateEventInput & { organizerId?: string }
): Promise<Event> {
  const now = Timestamp.now();

  const eventData = {
    ...data,
    registeredCount: 0,
    createdAt: now,
    updatedAt: now,
    // Convertimos fechas ISO a Timestamps de Firestore
    date: Timestamp.fromDate(new Date(data.date)),
    endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null,
  };

  const docRef = await adminDb.collection(EVENTS_COLLECTION).add(eventData);
  const newDoc = await docRef.get();

  return docToEvent(docRef.id, newDoc.data()!);
}

/**
 * Actualiza un evento existente.
 */
export async function updateEvent(
  id: string,
  data: Partial<CreateEventInput>
): Promise<Event | null> {
  const docRef = adminDb.collection(EVENTS_COLLECTION).doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: Timestamp.now(),
  };

  // Convertimos fechas si existen
  if (data.date) {
    updateData.date = Timestamp.fromDate(new Date(data.date));
  }
  if (data.endDate) {
    updateData.endDate = Timestamp.fromDate(new Date(data.endDate));
  }

  await docRef.update(updateData);
  const updatedDoc = await docRef.get();

  return docToEvent(docRef.id, updatedDoc.data()!);
}

/**
 * Elimina un evento.
 */
export async function deleteEvent(id: string): Promise<boolean> {
  const docRef = adminDb.collection(EVENTS_COLLECTION).doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return false;
  }

  await docRef.delete();
  return true;
}

/**
 * Registra un usuario en un evento.
 */
export async function registerForEvent(
  eventId: string,
  _userId?: string
): Promise<Event | null> {
  const docRef = adminDb.collection(EVENTS_COLLECTION).doc(eventId);

  // Usamos una transacción para garantizar consistencia
  const result = await adminDb.runTransaction(async (transaction) => {
    const docSnap = await transaction.get(docRef);

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data()!;
    const currentCount = data.registeredCount ?? 0;

    // Verificamos capacidad y estado
    if (currentCount >= data.capacity) {
      return null;
    }
    if (data.status !== 'publicado') {
      return null;
    }

    // Incrementamos contador
    transaction.update(docRef, {
      registeredCount: currentCount + 1,
      updatedAt: Timestamp.now(),
    });

    return {
      ...data,
      registeredCount: currentCount + 1,
    };
  });

  if (!result) {
    return null;
  }

  return docToEvent(eventId, result);
}

/**
 * Obtiene estadísticas generales.
 */
export async function getEventStats(): Promise<{
  total: number;
  published: number;
  upcoming: number;
  totalCapacity: number;
  totalRegistered: number;
}> {
  const snapshot = await adminDb.collection(EVENTS_COLLECTION).get();

  const events = snapshot.docs.map((doc) => doc.data());
  const now = new Date();

  const published = events.filter((e) => e.status === 'publicado');
  const upcoming = published.filter((e) => {
    const eventDate = e.date instanceof Timestamp ? e.date.toDate() : new Date(e.date);
    return eventDate > now;
  });

  return {
    total: events.length,
    published: published.length,
    upcoming: upcoming.length,
    totalCapacity: events.reduce((sum, e) => sum + (e.capacity || 0), 0),
    totalRegistered: events.reduce((sum, e) => sum + (e.registeredCount || 0), 0),
  };
}

/**
 * Obtiene eventos creados por un usuario específico.
 */
export async function getEventsByOrganizer(organizerId: string): Promise<Event[]> {
  const snapshot = await adminDb
    .collection(EVENTS_COLLECTION)
    .where('organizerId', '==', organizerId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => docToEvent(doc.id, doc.data()));
}
