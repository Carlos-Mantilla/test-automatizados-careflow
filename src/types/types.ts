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
