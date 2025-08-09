/**
 * Tipos compartidos de la aplicación
 */

// ==================== CHAT & MENSAJES ====================

/**
 * Estructura de un mensaje de chat (OpenAI y chat interno)
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ==================== FORMULARIOS ====================

/**
 * Datos del formulario principal de testeo
 */
export interface FormData {
  urlEasyPanel: string;
  contactId: string;
  locationId: string;
  emailTester: string;
}

// ==================== BOT API ====================

/**
 * Payload mínimo requerido para el bot EasyPanel
 */
export interface MinimalBotPayload {
  location: { id: string };
  phone: string;
  contact_id: string;
  message: { body: string };
}

/**
 * Respuesta estándar de operaciones con el bot
 */
export interface BotApiResponse {
  ok: boolean;
  status: number;
  data: Record<string, unknown>;
}

// ==================== RESULTADOS DE OPERACIONES ====================

/**
 * Resultado de una operación de testeo
 */
export interface TestResult {
  success: boolean;
  message: string;
  data?: unknown;
  messageBody?: string;
  botResponse?: unknown;
}
