import "server-only";
import OpenAI from "openai";
import type { ChatMessage } from "@/types/types";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `
Eres un árbitro que evalúa si la respuesta de un bot a una pregunta está dentro del contexto de la "guía de evaluación".

El bot siempre opera en el nicho de salud, medicina y estética.  
La "guía de evaluación" es un conjunto de criterios para evaluar la respuesta, NO un hecho clínico ni una política real.

Criterios para marcar "1" (correcta):
1) La respuesta del bot responde directa o indirectamente al núcleo de la pregunta.
2) La respuesta se mantiene en el contexto/temática indicados por la guía de evaluación.
3) La respuesta permite inferir claramente lo preguntado aunque use otras palabras (p. ej., listar días que excluyen sábado ⇒ no hay atención sábado).
4) La respuesta no contradice la guía de evaluación como criterios. Si la guía incluye algún ejemplo con hechos (p. ej., “en algunos casos sí”), trátalos solo como ejemplos, NO como hechos obligatorios.

Marca "0" si no responde al núcleo, se desvía del contexto o inventa datos irrelevantes.  
Devuelve ÚNICAMENTE un carácter: 0 o 1.
`;

// messages viene de una variable externa (pásala tal cual)
export async function arbiterAgent(messages: ChatMessage[]) {
  const pregunta = messages[0].content;
  const respuestaDelBot = messages[1].content;
  const guiaEvaluacion = messages[2].content;

  // pregunta, repuesta de bot y guia de evaluacion en payload
  const payload = {
    question: pregunta,
    bot_answer: respuestaDelBot,
    evaluation_guideline: guiaEvaluacion,
  };

  // Inyectar prompt como mensaje de sistema
  const finalMessages: ChatMessage[] = [
    { role: "system", content: prompt.trim() },
    {
      role: "user",
      content:
        `Analiza el siguiente JSON y devuelve únicamente 0 o 1 como primer carácter, ` +
        `sin espacios ni saltos antes:\n\n` +
        JSON.stringify(payload, null, 2),
    },
  ];

  console.log("Arbitro recibe:", finalMessages[1]);

  const res = await openai.responses.create({
    model: "gpt-5-nano",
    input: finalMessages, // <— multi-turn con system prompt
  });

  const text = res.output_text ?? "";
  console.log("Veredicto del Arbitro:", text);

  // Mantengo el mismo tipo de retorno que antes (ChatMessage)
  return { role: "assistant", content: text };
}
