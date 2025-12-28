// =============================================================================
// SERVICIO GEMINI AI - Module 5: EventPass Pro
// =============================================================================
// Integración con Google Gemini para generación de descripciones de eventos.
//
// ## Gemini AI
// Gemini es el modelo de IA de Google, similar a GPT.
// Usamos el SDK oficial @google/generative-ai.
//
// ## Casos de uso en EventPass
// 1. Generar descripciones atractivas de eventos
// 2. Sugerir etiquetas basadas en el contenido
// 3. Mejorar textos existentes
// =============================================================================

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Inicializa el cliente de Gemini.
 *
 * ## API Key
 * La API key se obtiene desde Google AI Studio:
 * https://aistudio.google.com/apikey
 */
function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ Gemini AI: API key no configurada.');
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Input para generar descripción de evento.
 */
interface GenerateDescriptionInput {
  title: string;
  category: string;
  location: string;
  date: string;
  additionalInfo?: string;
}

/**
 * Genera una descripción atractiva para un evento.
 *
 * ## Prompt Engineering
 * El prompt está diseñado para:
 * 1. Ser profesional pero atractivo
 * 2. Incluir información relevante
 * 3. Generar contenido en español
 * 4. Mantener una longitud apropiada (100-200 palabras)
 *
 * @param input - Información básica del evento
 * @returns Descripción generada o null si hay error
 */
export async function generateEventDescription(
  input: GenerateDescriptionInput
): Promise<string | null> {
  const client = getGeminiClient();

  if (!client) {
    return null;
  }

  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Genera una descripción atractiva y profesional para un evento con las siguientes características:

Título: ${input.title}
Categoría: ${input.category}
Ubicación: ${input.location}
Fecha: ${input.date}
${input.additionalInfo ? `Información adicional: ${input.additionalInfo}` : ''}

Requisitos:
- Escribe en español
- La descripción debe tener entre 100 y 200 palabras
- Usa un tono profesional pero atractivo
- Destaca los beneficios de asistir
- Incluye una llamada a la acción sutil al final
- No incluyas el título ni la fecha en la descripción (ya se muestran por separado)

Devuelve SOLO la descripción, sin títulos ni formateo adicional.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Error generando descripción con Gemini:', error);
    return null;
  }
}

/**
 * Genera etiquetas sugeridas para un evento.
 *
 * @param title - Título del evento
 * @param description - Descripción del evento
 * @returns Array de etiquetas sugeridas
 */
export async function generateEventTags(
  title: string,
  description: string
): Promise<string[]> {
  const client = getGeminiClient();

  if (!client) {
    return [];
  }

  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Analiza el siguiente evento y sugiere 5 etiquetas relevantes:

Título: ${title}
Descripción: ${description}

Requisitos:
- Las etiquetas deben ser palabras simples o términos cortos
- Deben ser relevantes para SEO y búsqueda
- En español
- Sin caracteres especiales ni espacios (usa guiones bajos si es necesario)
- Devuelve SOLO las etiquetas separadas por comas, sin explicaciones

Ejemplo de formato: tecnología, conferencia, desarrollo_web, networking, madrid`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parseamos las etiquetas
    const tags = text
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0 && tag.length <= 30)
      .slice(0, 5);

    return tags;
  } catch (error) {
    console.error('Error generando etiquetas con Gemini:', error);
    return [];
  }
}

/**
 * Mejora una descripción existente.
 *
 * @param description - Descripción original
 * @returns Descripción mejorada
 */
export async function improveDescription(description: string): Promise<string | null> {
  const client = getGeminiClient();

  if (!client) {
    return null;
  }

  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Mejora la siguiente descripción de evento haciéndola más atractiva y profesional:

Descripción original:
${description}

Requisitos:
- Mantén la información esencial
- Mejora la redacción y el estilo
- Hazla más atractiva y persuasiva
- Mantén una longitud similar
- Escribe en español
- Devuelve SOLO la descripción mejorada, sin explicaciones`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error mejorando descripción con Gemini:', error);
    return null;
  }
}
