/**
 * Lógica para testeo masivo de preguntas del bot
 */

import type {
  TestFormData,
  TestQuestion,
  QuestionTestResult,
  BatchTestProgress,
  ChatMessage,
} from "@/types/types";

/**
 * Envía una pregunta individual al bot y obtiene la respuesta
 * @param question - Pregunta a enviar
 * @param TestFormData - Datos del formulario (URL, IDs, etc.)
 * @returns Resultado del testeo de la pregunta
 */
async function testSingleQuestion(
  question: TestQuestion,
  TestFormData: TestFormData
): Promise<QuestionTestResult> {
  try {
    // Crear una copia del TestFormData pero con la pregunta como messageBody
    const testData = {
      ...TestFormData,
      // La pregunta va en el messageBody que se construye en el API
    };

    // Enviar al API con la pregunta en el payload
    const response = await fetch("/api/bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...testData,
        // Agregar la pregunta específica
        testQuestion: question.question,
      }),
    });

    const data = await response.json();

    // Extraer la respuesta del bot de EasyPanel
    const actualResponse = data?.data?.respuesta || "Sin respuesta del bot";

    // Enviar a OpenAI (arbiterAgent) la respuesta bot de EasyPanel + Pregunta + Respuesta esperada
    let arbiterVerdict: "0" | "1" | undefined;
    try {
      const arbiterMessages: ChatMessage[] = [
        { role: "user", content: `Pregunta: ${question.question}` },
        { role: "user", content: `Respuesta del bot: ${actualResponse}` },
        {
          role: "user",
          content: `Respuesta esperada: ${question.expected_response}`,
        },
      ];

      const arbiterRes = await fetch("/api/arbiterAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: arbiterMessages }),
      });
      const arbiterJson = await arbiterRes.json();
      const verdictRaw: string = arbiterJson?.message?.content ?? "";
      const onlyDigit = verdictRaw.trim().match(/^[012]/)?.[0];
      if (onlyDigit === "0" || onlyDigit === "1") {
        arbiterVerdict = onlyDigit;
      }
    } catch (arbiterErr) {
      console.error("Error llamando a arbiter (OpenAI):", arbiterErr);
    }

    return {
      questionId: question.id,
      question: question.question,
      expectedResponse: question.expected_response,
      actualResponse,
      success: data.ok,
      arbiterVerdict,
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
 * @param TestFormData - Datos del formulario
 * @param onProgress - Callback para reportar progreso
 * @param shouldStop - Función que retorna true si se debe detener el testeo
 * @param delayMs - Delay entre preguntas en millisegundos (default: 2000ms)
 * @returns Array de resultados
 */
export async function runBatchTesting(
  questions: TestQuestion[],
  TestFormData: TestFormData,
  onProgress: (progress: BatchTestProgress) => void,
  shouldStop: () => boolean,
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

  let stoppedEarly = false;
  for (let i = 0; i < questions.length; i++) {
    // Verificar si se debe detener el testeo
    if (shouldStop()) {
      // Reportar estado detenido
      onProgress({
        current: i,
        total,
        completed: [...results],
        isRunning: false,
      });
      stoppedEarly = true;
      break;
    }

    const question = questions[i];

    // Testear la pregunta actual
    const result = await testSingleQuestion(question, TestFormData);
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

      // Verificar nuevamente después del delay si se debe detener
      if (shouldStop()) {
        onProgress({
          current: i + 1,
          total,
          completed: [...results],
          isRunning: false,
        });
        stoppedEarly = true;
        break;
      }
    }
  }

  // Testeo completado solo si NO se detuvo anticipadamente
  if (!stoppedEarly) {
    onProgress({
      current: total,
      total,
      completed: [...results],
      isRunning: false,
    });
  }

  return results;
}

/**
 * Crea un resumen de los resultados del testeo masivo
 * @param results - Resultados del testeo
 * @param totalPlanned - Total de preguntas planeadas (opcional, para testeos interrumpidos)
 * @returns Resumen con estadísticas
 */
export function createBatchTestSummary(
  results: QuestionTestResult[],
  totalPlanned?: number
) {
  // Métricas de llamadas a EasyPanel
  const completed = results.length;
  const successful = results.filter((r) => r.success).length;
  const failed = completed - successful;
  const total = totalPlanned || completed; // Usar total planeado si se proporciona
  const successRate =
    completed > 0 ? Math.round((successful / completed) * 100) : 0;

  // Métricas por veredicto del árbitro
  const arbiterCorrect = results.filter((r) => r.arbiterVerdict === "1").length;
  const arbiterIncorrect = results.filter(
    (r) => r.arbiterVerdict === "0"
  ).length;
  const arbiterDecided = arbiterCorrect + arbiterIncorrect;
  const arbiterSuccessRate =
    arbiterDecided > 0
      ? Math.round((arbiterCorrect / arbiterDecided) * 100)
      : 0;

  const categoryCounts = results.reduce((acc, result) => {
    // Extraer categoría del ID (ej: "KG-01" -> "KG")
    const category = result.questionId.split("-")[0];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    // Metricas de llamadas a EasyPanel
    total,
    completed,
    successful,
    failed,
    successRate,
    // Veredicto del árbitro
    arbiterCorrect,
    arbiterIncorrect,
    arbiterDecided,
    arbiterSuccessRate,
    categoryCounts,
    duration:
      results.length > 0
        ? new Date(results[results.length - 1].timestamp).getTime() -
          new Date(results[0].timestamp).getTime()
        : 0,
  };
}
