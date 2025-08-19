// ==================== MAILEROO UTILITIES ====================

// Limpia el texto de n8n removiendo asteriscos
export const cleanN8nResponse = (text: string): string => {
  return text.replace(/\*/g, "").trim();
};

// Extrae todos los valores relevantes del texto de n8n
export const extractEmailData = (n8nResponse: string) => {
  const cleanedResponse = cleanN8nResponse(n8nResponse);

  // Extraer duración
  const duration =
    cleanedResponse.match(/Duracion: ([^\n]+)/)?.[1] ||
    cleanedResponse.match(/Duración: ([^\n]+)/)?.[1] ||
    "N/A";

  // Extraer porcentaje de éxito
  const successRate =
    cleanedResponse.match(/Exito: ([^\n]+)/)?.[1] ||
    cleanedResponse.match(/Éxito: ([^\n]+)/)?.[1] ||
    "N/A";

  // Extraer enlace de descarga
  let downloadUrl = null;
  let downloadMatch = cleanedResponse.match(
    /Descargar JSON: (https:\/\/[^\s]+)/
  );

  if (!downloadMatch) {
    // Intentar sin los dos puntos
    downloadMatch = cleanedResponse.match(/Descargar JSON (https:\/\/[^\s]+)/);
  }

  if (!downloadMatch) {
    // Intentar buscar cualquier URL de Google Drive
    downloadMatch = cleanedResponse.match(
      /(https:\/\/drive\.google\.com\/[^\s]+)/
    );
  }

  if (downloadMatch) {
    downloadUrl = downloadMatch[1];
  }

  // Extraer información del cliente
  const clientName = cleanedResponse.match(/Cliente: ([^\n]+)/)?.[1] || "N/A";

  // Extraer fecha de generación
  const generatedDate =
    cleanedResponse.match(/Generado el: ([^\n]+)/)?.[1] || "N/A";

  // Extraer URL del panel
  const panelUrl =
    cleanedResponse.match(/urlEasyPanel: ([^\n]+)/)?.[1] || "N/A";

  // Extraer location ID
  const locationId =
    cleanedResponse.match(/locationID: ([^\n]+)/)?.[1] || "N/A";

  // Extraer contact ID
  const contactId = cleanedResponse.match(/contactID: ([^\n]+)/)?.[1] || "N/A";

  // Extraer métricas de evaluación
  const evaluated = cleanedResponse.match(/Evaluadas: ([^,]+)/)?.[1] || "N/A";
  const correct = cleanedResponse.match(/Correctas: ([^,]+)/)?.[1] || "N/A";
  const incorrect = cleanedResponse.match(/Incorrectas: ([^,]+)/)?.[1] || "N/A";

  // Extraer métricas de llamadas HTTP
  const httpSuccess =
    cleanedResponse.match(/Llamadas HTTP Exitosas: ([^,]+)/)?.[1] || "N/A";
  const httpFailed =
    cleanedResponse.match(/Llamadas HTTP Fallidas: ([^,]+)/)?.[1] || "N/A";

  return {
    cleanedResponse,
    duration,
    successRate,
    downloadUrl,
    clientName,
    generatedDate,
    panelUrl,
    locationId,
    contactId,
    evaluated,
    correct,
    incorrect,
    httpSuccess,
    httpFailed,
  };
};

/**
 * Tipos para los datos extraídos
 */
export interface EmailData {
  cleanedResponse: string;
  duration: string;
  successRate: string;
  downloadUrl: string | null;
  clientName: string;
  generatedDate: string;
  panelUrl: string;
  locationId: string;
  contactId: string;
  evaluated: string;
  correct: string;
  incorrect: string;
  httpSuccess: string;
  httpFailed: string;
}
