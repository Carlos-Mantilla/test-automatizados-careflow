/**
 * Hook personalizado para testeo masivo de preguntas
 */

import { useState, useCallback, useRef } from "react";
import { runBatchTesting, createBatchTestSummary } from "@/helpers/batchTesting";
import type { FormData, TestQuestion, BatchTestProgress } from "@/types/types";

export function useBatchTesting() {
  const [progress, setProgress] = useState<BatchTestProgress>({
    current: 0,
    total: 0,
    completed: [],
    isRunning: false
  });

  const [summary, setSummary] = useState<ReturnType<typeof createBatchTestSummary> | null>(null);
  const shouldStopRef = useRef(false);

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
      shouldStopRef.current = false;
      
      // Ejecutar testeo con callback de progreso
      const results = await runBatchTesting(
        questions,
        formData,
        setProgress,
        () => shouldStopRef.current, // Función que verifica si se debe parar
        delayMs
      );

      // Crear resumen final (incluso si se detuvo antes)
      const finalSummary = createBatchTestSummary(results, questions.length);
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
   * Detiene el testeo masivo en progreso
   */
  const stopBatchTest = useCallback(() => {
    shouldStopRef.current = true;
    
    // Marcar inmediatamente como no corriendo
    setProgress(prev => ({ ...prev, isRunning: false }));
    
    // Crear resumen parcial y corregir progreso tras detener
    setTimeout(() => {
      setProgress(prev => {
        const updated = {
          ...prev,
          current: prev.completed.length, // asegurar progreso correcto
          isRunning: false
        };
        if (prev.completed.length > 0) {
          const partialSummary = createBatchTestSummary(prev.completed, prev.total);
          setSummary(partialSummary);
        }
        return updated;
      });
    }, 200); // pequeño delay para capturar la última respuesta en vuelo
  }, []);

  /**
   * Resetea el estado del testeo masivo
   */
  const resetBatchTest = useCallback(() => {
    shouldStopRef.current = false;
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
