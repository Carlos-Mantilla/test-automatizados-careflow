/**
 * Lógica para testeo masivo de preguntas del bot
 */

import type {
  FormData,
  TestQuestion,
  QuestionTestResult,
  BatchTestProgress,
} from "@/types/types";

/**
 * Envía una pregunta individual al bot y obtiene la respuesta
 * @param question - Pregunta a enviar
 * @param formData - Datos del formulario (URL, IDs, etc.)
 * @returns Resultado del testeo de la pregunta
 */
async function testSingleQuestion(
  question: TestQuestion,
  formData: FormData
): Promise<QuestionTestResult> {
  try {
    // Crear una copia del formData pero con la pregunta como messageBody
    const testData = {
      ...formData,
      // La pregunta va en el messageBody que se construye en el API
    };

    // Modificar temporalmente el emailTester para incluir el ID de la pregunta
    const modifiedFormData = {
      ...testData,
      emailTester: `${formData.emailTester} - Test ID: ${question.id}`,
    };

    // Enviar al API con la pregunta en el payload
    const response = await fetch("/api/bot/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...modifiedFormData,
        // Agregar la pregunta específica
        testQuestion: question.question,
      }),
    });

    const data = await response.json();

    // Extraer la respuesta del bot
    const actualResponse = data?.data?.respuesta || "Sin respuesta del bot";

    return {
      questionId: question.id,
      question: question.question,
      expectedResponse: question.expected_response,
      actualResponse,
      success: data.ok,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error testing question ${question.id}:`, error);
    return {
      questionId: question.id,
      question: question.question,
      expectedResponse: question.expected_response,
      actualResponse: "Error de conexión",
      success: false,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Ejecuta testeo masivo de todas las preguntas
 * @param questions - Array de preguntas a testear
 * @param formData - Datos del formulario
 * @param onProgress - Callback para reportar progreso
 * @param delayMs - Delay entre preguntas en millisegundos (default: 2000ms)
 * @returns Array de resultados
 */
export async function runBatchTesting(
  questions: TestQuestion[],
  formData: FormData,
  onProgress: (progress: BatchTestProgress) => void,
  delayMs: number = 2000
): Promise<QuestionTestResult[]> {
  const results: QuestionTestResult[] = [];
  const total = questions.length;

  // Reportar inicio
  onProgress({
    current: 0,
    total,
    completed: [],
    isRunning: true,
  });

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    // Testear la pregunta actual
    const result = await testSingleQuestion(question, formData);
    results.push(result);

    // Reportar progreso
    onProgress({
      current: i + 1,
      total,
      completed: [...results],
      isRunning: i < questions.length - 1,
    });

    // Delay entre preguntas (excepto en la última)
    if (i < questions.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // Testeo completado
  onProgress({
    current: total,
    total,
    completed: results,
    isRunning: false,
  });

  return results;
}

/**
 * Crea un resumen de los resultados del testeo masivo
 * @param results - Resultados del testeo
 * @returns Resumen con estadísticas
 */
export function createBatchTestSummary(results: QuestionTestResult[]) {
  const total = results.length;
  const successful = results.filter((r) => r.success).length;
  const failed = total - successful;
  const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

  const categoryCounts = results.reduce((acc, result) => {
    // Extraer categoría del ID (ej: "KG-01" -> "KG")
    const category = result.questionId.split("-")[0];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    successful,
    failed,
    successRate,
    categoryCounts,
    duration:
      results.length > 0
        ? new Date(results[results.length - 1].timestamp).getTime() -
          new Date(results[0].timestamp).getTime()
        : 0,
  };
}
