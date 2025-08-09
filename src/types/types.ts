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

// ==================== TESTEO MASIVO ====================

/**
 * Estructura de una pregunta de testeo
 */
export interface TestQuestion {
  id: string;
  category: string;
  question: string;
  expected_response: string;
}

/**
 * Resultado de testeo de una pregunta individual
 */
export interface QuestionTestResult {
  questionId: string;
  question: string;
  expectedResponse: string;
  actualResponse: string;
  success: boolean;
  timestamp: string;
}

/**
 * Progreso del testeo masivo
 */
export interface BatchTestProgress {
  current: number;
  total: number;
  completed: QuestionTestResult[];
  isRunning: boolean;
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
