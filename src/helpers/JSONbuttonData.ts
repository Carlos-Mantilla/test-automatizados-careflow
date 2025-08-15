import type { SummaryData, QuestionTestResult, TestFormData } from "@/types/types";

/**
 * Genera el payload JSON estándar para los botones de descarga y envío
 * @param summary - Datos del resumen de testeo
 * @param results - Resultados de las preguntas testeadas
 * @param testFormData - Datos del formulario de testeo
 * @param formattedTime - Tiempo formateado de duración
 * @returns Payload JSON estructurado
 */
export function generateTestReportPayload(
  summary: SummaryData,
  results: QuestionTestResult[],
  testFormData: TestFormData,
  formattedTime: string
) {
  // Obtener el nombre del cliente de la URL EasyPanel
  const clientName = testFormData.urlEasyPanel.split("host/")[1];

  return {
    metadata: {
      nombreCliente: clientName,
      fechaHora: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }) + " (Mexico_City)",
      urlEasyPanel: testFormData.urlEasyPanel,
      locationId: testFormData.locationId,
      contactId: testFormData.contactId,
      totalPreguntas: summary.total,
      preguntasCompletadas: summary.completed,
      duracionTest: formattedTime,
    },
    metricasTesteo: {
      llamadasHTTP: {
        total: summary.total,
        completadas: summary.completed,
        exitosas: summary.successful,
        fallidas: summary.failed,
        tasaExito: summary.successRate,
      },
      resultadoTest: {
        correctas: summary.arbiterCorrect ?? 0,
        incorrectas: summary.arbiterIncorrect ?? 0,
        evaluadas: summary.arbiterDecided ?? 0,
        tasaExito: summary.arbiterSuccessRate ?? 0,
      },
      categorias: summary.categoryCounts,
    },
    resultados: results.map(result => ({
      id: result.questionId,
      pregunta: result.question,
      respuestaEsperada: result.expectedResponse,
      respuestaBot: result.actualResponse,
      hora: result.timestamp,
      veredicto: result.arbiterVerdict === "1" ? "✅" : "❌",
    })),
  };
}
