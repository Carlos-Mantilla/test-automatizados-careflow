"use client";
/** 
 * useBatchFlow: orquestación de UI.
 * Añade/manda mensajes de sistema (inicio/fin/error).
 * Llama a executeBatchTest.
 * Resetea el timer y hace scroll al resumen.
*/

import { useCallback } from "react";
import type { ChatMessage, TestFormData, TestQuestion, QuestionTestResult } from "@/types/types";
import { addChatMessage } from "@/helpers/chatUtils";

interface UseBatchFlowDeps {
  executeBatchTest: (
    questions: TestQuestion[],
    TestFormData: TestFormData,
    delayMs?: number
  ) => Promise<QuestionTestResult[]>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  resetTimer: () => void;
  testQuestions: TestQuestion[];
}

export function useBatchFlow({ executeBatchTest, setMessages, summaryRef, resetTimer, testQuestions }: UseBatchFlowDeps) {
  const startBatch = useCallback(async (TestFormData: TestFormData) => {
    // 1) Mensaje de inicio
    setMessages(prev => addChatMessage(prev, "system", `Iniciando testeo automático: ${testQuestions.length} preguntas...`));

    try {
      // 2) Ejecutar Testeo automático
      await executeBatchTest(testQuestions, TestFormData);

      // 3) Mensaje de finalización
      setMessages(prev => addChatMessage(prev, "system", "Testeo automático completado. Ver resumen más abajo. ✅"));

      // 4) Reset de timer para que el botón vuelva a INICIAR
      resetTimer();

      // 5) Scroll controlado al resumen
      setTimeout(() => {
        if (summaryRef.current) {
          summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);

    } catch (error) {
      console.error("Error en Testeo automático:", error);
      setMessages(prev => addChatMessage(prev, "system", "Error en Testeo automático ❌"));
      resetTimer();
    }
  }, [executeBatchTest, setMessages, summaryRef, resetTimer, testQuestions]);

  return { startBatch };
}


