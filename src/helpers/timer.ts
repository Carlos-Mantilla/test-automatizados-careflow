/**
 * Funciones helper para funcionalidad del temporizador
 */

/**
 * Formatea segundos en formato MM:SS
 * @param elapsedSeconds - Total de segundos transcurridos
 * @returns String de tiempo formateado (MM:SS)
 */
export function formatTime(elapsedSeconds: number): string {
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/**
 * Inicia el temporizador configurando un intervalo
 * @param setElapsedSeconds - Función para actualizar segundos transcurridos
 * @param intervalRef - Referencia para almacenar el ID del intervalo
 * @returns El ID del intervalo
 */
export function startTimer(
  setElapsedSeconds: (value: number | ((prev: number) => number)) => void,
  intervalRef: React.MutableRefObject<number | null>
): number {
  const intervalId = window.setInterval(() => {
    setElapsedSeconds((prev) => prev + 1);
  }, 1000);
  
  intervalRef.current = intervalId;
  return intervalId;
}

/**
 * Detiene el temporizador limpiando el intervalo
 * @param intervalRef - Referencia que contiene el ID del intervalo
 */
export function stopTimer(intervalRef: React.MutableRefObject<number | null>): void {
  if (intervalRef.current) {
    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
}

/**
 * Reinicia el temporizador a 0
 * @param setElapsedSeconds - Función para actualizar segundos transcurridos
 */
export function resetTimer(
  setElapsedSeconds: (value: number | ((prev: number) => number)) => void
): void {
  setElapsedSeconds(0);
}
