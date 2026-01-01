import { adminDb } from '@/lib/firebase/admin';
import { db } from '@/lib/firebase/config';
import { Event } from '@/types/event';
import { collection, doc, getDoc, getDocs, query, where, orderBy, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';

// ============================================================================
// CLIENT-SIDE (Usar en componentes 'use client' o hooks)
// ============================================================================

export async function getEventsClient(status?: string): Promise<Event[]> {
  const eventsRef = collection(db, 'events');
  let q = query(eventsRef, orderBy('date', 'asc'));

  if (status && status !== 'todos') {
    q = query(q, where('status', '==', status));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
}

// ============================================================================
// SERVER-SIDE (Usar en Server Actions, API Routes o Server Components)
// ============================================================================

const EVENTS_COLLECTION = 'events';

export async function getEvents(status?: string): Promise<Event[]> {
  const eventsRef = adminDb.collection(EVENTS_COLLECTION);
  let query = eventsRef.orderBy('date', 'asc');

  if (status && status !== 'todos') {
    query = query.where('status', '==', status);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date.toDate().toISOString(),
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
    } as Event;
  });
}

export async function getEventById(id: string): Promise<Event | null> {
  const doc = await adminDb.collection(EVENTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  return {
    id: doc.id,
    ...data,
    date: data.date.toDate().toISOString(),
    createdAt: data.createdAt?.toDate().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString(),
  } as Event;
}

export async function createEvent(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
  const docRef = adminDb.collection(EVENTS_COLLECTION).doc();
  const now = new Date();

  const eventData = {
    ...data,
    date: new Date(data.date), // Admin SDK supports native Date objects
    createdAt: now,
    updatedAt: now,
  };

  await docRef.set(eventData);

  return {
    id: docRef.id,
    ...data,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  } as Event;
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event> {
  const docRef = adminDb.collection(EVENTS_COLLECTION).doc(id);
  const now = new Date();

  const updateData: any = {
    ...data,
    updatedAt: now,
  };

  if (data.date) {
    updateData.date = new Date(data.date);
  }

  await docRef.update(updateData);

  return {
    id,
    ...data,
    updatedAt: now.toISOString(),
  } as Event;
}

export async function deleteEvent(id: string): Promise<void> {
  await adminDb.collection(EVENTS_COLLECTION).doc(id).delete();
}

export async function registerForEvent(eventId: string, userId: string): Promise<Event> {
  const eventRef = adminDb.collection(EVENTS_COLLECTION).doc(eventId);
  const registrationRef = eventRef.collection('registrations').doc(userId);

  // Usamos una TRANSACCIÓN (runTransaction) para garantizar la integridad de los datos.
  // En bases de datos NoSQL distribuidas como Firestore, las condiciones de carrera (race conditions)
  // son comunes cuando múltiples usuarios intentan modificar el mismo recurso simultáneamente.
  //
  // La transacción asegura que:
  // 1. Leemos el estado actual del evento (capacidad, registrados).
  // 2. Verificamos las reglas de negocio (¿está lleno? ¿ya está registrado?).
  // 3. Escribimos los cambios SOLO si el estado no ha cambiado desde la lectura.
  // Si algo cambió concurrentemente, la transacción se reintenta automáticamente.
  return await adminDb.runTransaction(async (t) => {
    const eventDoc = await t.get(eventRef);
    if (!eventDoc.exists) {
      throw new Error('Evento no encontrado');
    }

    const registrationDoc = await t.get(registrationRef);
    if (registrationDoc.exists) {
      throw new Error('UserAlreadyRegistered');
    }

    const data = eventDoc.data()!;
    const currentCount = data.registeredCount || 0;
    const capacity = data.capacity || 0;

    if (currentCount >= capacity) {
      throw new Error('EventFull');
    }

    // Registrar usuario
    t.set(registrationRef, {
      userId,
      registeredAt: new Date(),
    });

    // Actualizar contador
    const newCount = currentCount + 1;
    t.update(eventRef, {
      registeredCount: newCount
    });

    // Retorner evento actualizado
    return {
      id: eventDoc.id,
      ...data,
      registeredCount: newCount,
      date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : new Date(data.date).toISOString(),
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString(),
      updatedAt: new Date().toISOString(), // Optimistic update for return
    } as Event;
  });
}
