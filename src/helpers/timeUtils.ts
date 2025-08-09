/**
 * Utilidades puras para manejo de tiempo
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
 * Convierte formato MM:SS a segundos totales
 * @param timeString - String en formato MM:SS
 * @returns Total de segundos
 */
export function parseTimeToSeconds(timeString: string): number {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return (minutes * 60) + seconds;
}

/**
 * Agrega segundos a un tiempo formateado
 * @param currentTime - Tiempo actual en formato MM:SS
 * @param secondsToAdd - Segundos a agregar
 * @returns Nuevo tiempo formateado
 */
export function addSecondsToTime(currentTime: string, secondsToAdd: number): string {
  const currentSeconds = parseTimeToSeconds(currentTime);
  const newSeconds = currentSeconds + secondsToAdd;
  return formatTime(newSeconds);
}

/**
 * Formatea milisegundos a formato legible (minutos y segundos)
 * @param milliseconds - Milisegundos a formatear
 * @returns String formateado (ej: "2min 30s", "45s")
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}min ${seconds}s`;
  }
  return `${seconds}s`;
}
