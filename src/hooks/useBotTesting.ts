/**
 * Custom hook para manejar lógica de testeo del bot
 */

import { useState, useCallback } from "react";
import { sendToModel } from "@/helpers/sendToModel";
import type { FormData, TestResult } from "@/types/types";

export interface BotTestingState {
  isLoading: boolean;
  lastResult: TestResult | null;
  error: string | null;
}

export interface BotTestingActions {
  executeTest: (formData: FormData) => Promise<TestResult>;
  clearResults: () => void;
}

export function useBotTesting(): BotTestingState & BotTestingActions {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeTest = useCallback(async (formData: FormData): Promise<TestResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await sendToModel(formData);
      setLastResult(result);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch {
      const errorMessage = "Error inesperado durante el testeo";
      const errorResult: TestResult = {
        success: false,
        message: errorMessage,
      };
      
      setError(errorMessage);
      setLastResult(errorResult);
      
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setLastResult(null);
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    lastResult,
    error,
    // Actions
    executeTest,
    clearResults,
  };
}
