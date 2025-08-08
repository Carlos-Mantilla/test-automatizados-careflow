/**
 * Cliente para comunicación con OpenAI
 */

import type { ChatMessage } from "@/lib/openai";

/**
 * Datos del formulario de testeo (para otra API futura)
 */
export interface TestFormData {
  urlEasyPanel: string;
  contactId: string;
  locationId: string;
  emailTester: string;
}

/**
 * Envía un prompt específico al modelo OpenAI
 * @param prompt - Texto/datos específicos para el modelo
 * @param systemMessage - Instrucciones del sistema (opcional)
 * @returns Respuesta del modelo
 */
export async function sendToOpenAI(
  prompt: string,
  systemMessage: string = "Responde en español y en una sola línea."
): Promise<string> {
  try {
    const messages: ChatMessage[] = [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ];

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data?.message?.content ?? "Sin respuesta";
  } catch (error) {
    console.error("Error enviando a OpenAI:", error);
    return "Error al comunicarse con el modelo";
  }
}

/**
 * Agrega un mensaje al historial del chat
 * @param messages - Historial actual
 * @param role - Rol del mensaje (user/assistant)
 * @param content - Contenido del mensaje
 * @returns Nuevo historial con el mensaje agregado
 */
export function addChatMessage(
  messages: ChatMessage[],
  role: "user" | "assistant",
  content: string
): ChatMessage[] {
  return [...messages, { role, content }];
}
