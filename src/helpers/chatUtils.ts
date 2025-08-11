/**
 * Utilidades puras para manejo del chat
 */

import type { ChatMessage } from "@/types/types";

// Agrega un único mensaje al historial
export function addChatMessage(
  messages: ChatMessage[],
  role: "user" | "assistant" | "system",
  content: string
): ChatMessage[] {
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return [...messages, { role, content, timestamp }];
}

// Función para hacer scroll al final del chat
export function scrollToBottom(
  chatRef: React.RefObject<HTMLDivElement | null>
): void {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}
