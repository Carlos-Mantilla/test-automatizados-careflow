/**
 * Utilidades puras para manejo de tiempo
 */


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
