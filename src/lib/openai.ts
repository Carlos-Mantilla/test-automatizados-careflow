import "server-only";
import OpenAI from "openai";
import type { ChatMessage } from "@/types/types";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `
  Eres un arbitro que se encargara de juzgar la repuesta de un bot que atiende un consultorio y compararla con la respuesta esperada para determinar si es correcta o no. La repuesta del bot debe ser similar dentro del contexto de la pregunta, puede ser una variacion de la respuesta esperada y no siempre debe ser la misma, esto es para determinar si el bot esta generando una repuesta dentro del contexto de la pregunta y no está alucinando o fuera de lugar. 
  No debes devolver ningun comentario adicional, solo el numero 0, 1.
  Si la respuesta es no es similar o no entra en el contexto de la pregunta, debes devolver "0".
  Si la respuesta es es similar o entra en el contexto de la pregunta, debes devolver "1".
`;

// messages viene de una variable externa (pásala tal cual)
export async function arbiterAgent(messages: ChatMessage[]) {
  const pregunta = messages[0].content;
  const respuestaDelBot = messages[1].content;
  const respuestaEsperada = messages[2].content;

  // Inyectar prompt como mensaje de sistema
  const finalMessages: ChatMessage[] = [
    { role: "system", content: prompt.trim() },
    {
      role: "user",
      content: `${pregunta} \n${respuestaDelBot} \n${respuestaEsperada}`,
    },
  ];

  // console.log("Arbitro recibe:", finalMessages);

  const res = await openai.responses.create({
    model: "gpt-5-nano", // usa el modelo que prefieras
    input: finalMessages, // <— multi-turn con system prompt
  });

  const text = res.output_text ?? "";
  console.log("Veredicto del Arbitro:", text);

  // Mantengo el mismo tipo de retorno que antes (ChatMessage)
  return { role: "assistant", content: text };
}
