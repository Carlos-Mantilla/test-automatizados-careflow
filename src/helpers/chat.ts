/**
 * Funciones helper para funcionalidad del chat
 */

/**
 * Hace scroll del contenedor del chat hacia abajo
 * @param chatRef - Referencia al elemento contenedor del chat
 */
export function scrollToBottom(chatRef: React.RefObject<HTMLDivElement | null>): void {
  if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}

/**
 * Agrega un nuevo mensaje al chat
 * @param messages - Array de mensajes actuales
 * @param setMessages - Función para actualizar mensajes
 * @param message - Nuevo mensaje a agregar
 */
export function addMessage(
  messages: string[],
  setMessages: React.Dispatch<React.SetStateAction<string[]>>,
  message: string
): void {
  setMessages([...messages, message]);
}

/**
 * Limpia todos los mensajes del chat
 * @param setMessages - Función para actualizar mensajes
 */
export function clearMessages(
  setMessages: React.Dispatch<React.SetStateAction<string[]>>
): void {
  setMessages([]);
}
