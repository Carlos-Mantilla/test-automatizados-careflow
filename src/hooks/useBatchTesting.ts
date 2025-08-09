/**
 * Hook personalizado para testeo masivo de preguntas
 */

import { useState, useCallback } from "react";
import { runBatchTesting, createBatchTestSummary } from "@/helpers/batchTesting";
import type { FormData, TestQuestion, QuestionTestResult, BatchTestProgress } from "@/types/types";

export function useBatchTesting() {
  const [progress, setProgress] = useState<BatchTestProgress>({
    current: 0,
    total: 0,
    completed: [],
    isRunning: false
  });

  const [summary, setSummary] = useState<ReturnType<typeof createBatchTestSummary> | null>(null);

  /**
   * Ejecuta el testeo masivo
   */
  const executeBatchTest = useCallback(async (
    questions: TestQuestion[],
    formData: FormData,
    delayMs?: number
  ) => {
    try {
      // Resetear estado
      setSummary(null);
      
      // Ejecutar testeo con callback de progreso
      const results = await runBatchTesting(
        questions,
        formData,
        setProgress,
        delayMs
      );

      // Crear resumen final
      const finalSummary = createBatchTestSummary(results);
      setSummary(finalSummary);

      return results;
    } catch (error) {
      console.error("Error en testeo masivo:", error);
      
      // Marcar como no corriendo en caso de error
      setProgress(prev => ({ ...prev, isRunning: false }));
      
      throw error;
    }
  }, []);

  /**
   * Detiene el testeo masivo (si fuera necesario implementar cancelación)
   */
  const stopBatchTest = useCallback(() => {
    setProgress(prev => ({ ...prev, isRunning: false }));
  }, []);

  /**
   * Resetea el estado del testeo masivo
   */
  const resetBatchTest = useCallback(() => {
    setProgress({
      current: 0,
      total: 0,
      completed: [],
      isRunning: false
    });
    setSummary(null);
  }, []);

  return {
    progress,
    summary,
    executeBatchTest,
    stopBatchTest,
    resetBatchTest,
    isRunning: progress.isRunning,
    hasResults: progress.completed.length > 0
  };
}
