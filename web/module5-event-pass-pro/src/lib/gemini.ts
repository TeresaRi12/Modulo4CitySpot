import { GoogleGenAI } from '@google/genai';

// Initialize the Google GenAI client
// We use the API key from environment variables
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Constants for models
export const GEMINI_MODELS = {
  TEXT: 'gemini-3-flash-preview', // Requested by user
  IMAGE: 'gemini-3-pro-image-preview', // Requested by user
};

/**
 * Get the generative AI client
 */
export const getGeminiClient = () => {
  return genAI;
};
