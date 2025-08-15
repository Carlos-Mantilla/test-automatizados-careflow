/**
 * Custom hook para funcionalidad de temporizador
 */

import { useState, useRef, useCallback, useMemo } from "react";

export function useTimer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Formatear tiempo en MM:SS
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [elapsedSeconds]);

  // Iniciar temporizador
  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      const intervalId = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      intervalRef.current = intervalId;
    }
  }, [isRunning]);

  // Parar temporizador
  const stop = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  }, []);

  // Reiniciar temporizador
  const reset = useCallback(() => {
    stop();
    setElapsedSeconds(0);
  }, [stop]);

  // Cleanup effect cuando se desmonta el componente
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
  }, []);

  return {
    isRunning,
    formattedTime,
    start,
    reset,
    cleanup
  };
}
