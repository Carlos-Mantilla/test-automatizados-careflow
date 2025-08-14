// Tipos compartidos de la aplicación

// Estructura de un mensaje de chat (OpenAI y chat interno)
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  expectedResponse?: string; // Para testeo masivo: respuesta esperada del bot
  timestamp?: string; // Hora local en la que se añadió el mensaje
  arbiterVerdict?: "0" | "1"; // Veredicto del árbitro para mensajes del bot
}

// Datos del formulario principal de testeo
export interface TestFormData {
  urlEasyPanel: string;
  contactId: string;
  locationId: string;
}


// ==================== TESTEO MASIVO ====================

// Estructura de una pregunta de testeo
export interface TestQuestion {
  id: string;
  category: string;
  question: string;
  evaluation_guideline: string;
}

// Resultado de testeo de una pregunta individual
export interface QuestionTestResult {
  questionId: string;
  question: string;
  expectedResponse: string;
  actualResponse: string;
  success: boolean;
  arbiterVerdict?: "0" | "1" ; // 0 = incorrecto, 1 = correcto
  timestamp: string;
}

// Progreso del testeo masivo
export interface BatchTestProgress {
  current: number;
  total: number;
  completed: QuestionTestResult[];
  isRunning: boolean;
}


// Resultado de una operación de testeo
export interface TestResult {
  success: boolean;
  message: string;
  data?: unknown;
  messageBody?: string;
  botResponse?: unknown;
}
