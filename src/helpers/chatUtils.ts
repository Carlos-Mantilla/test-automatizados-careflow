/**
 * Utilidades puras para manejo del chat
 */

import type { ChatMessage, TestResult } from "@/types/types";

/**
 * Crea mensajes de chat para un proceso de testeo
 */
export function createTestingMessages(result: TestResult): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Mensaje de estado
  messages.push({
    role: "system",
    content: result.message,
    timestamp: now
  });

  // Mensaje enviado al bot (si existe)
  if (result.messageBody) {
    messages.push({
      role: "user", 
      content: result.messageBody,
      timestamp: now
    });
  }

  // Respuesta del bot (si existe)
  if (result.botResponse) {
    const botMessage = extractBotMessage(result.botResponse);
    messages.push({
      role: "assistant",
      content: botMessage,
      timestamp: now
    });
  }

  return messages;
}

/**
 * Extrae el mensaje principal de la respuesta del bot
 */
export function extractBotMessage(botResponse: unknown): string {
  try {
    const botData = botResponse as {
      data?: { respuesta?: string; agente?: string };
    };
    
    return botData?.data?.respuesta || "Sin respuesta del bot";
  } catch {
    return "Error al procesar respuesta del bot";
  }
}

/**
 * Agrega múltiples mensajes a un historial existente
 */
export function addMultipleMessages(
  currentMessages: ChatMessage[], 
  newMessages: ChatMessage[]
): ChatMessage[] {
  return [...currentMessages, ...newMessages];
}

/**
 * Agrega un único mensaje al historial
 */
export function addChatMessage(
  messages: ChatMessage[],
  role: "user" | "assistant" | "system",
  content: string
): ChatMessage[] {
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return [...messages, { role, content, timestamp }];
}

/**
 * Función para hacer scroll al final del chat
 */
export function scrollToBottom(chatRef: React.RefObject<HTMLDivElement | null>): void {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}
