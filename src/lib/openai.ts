import "server-only";
import OpenAI from "openai";
import type { ChatMessage } from "@/types/types";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// messages viene de una variable externa (pásala tal cual)
export async function arbiterAgent(messages: ChatMessage[]) {
  const res = await openai.responses.create({
    model: "gpt-4o-mini", // usa el modelo que prefieras
    input: messages, // <— multi-turn nativo (sin .map/.join)
    temperature: 0.2,
  });

  const text = res.output_text ?? "";
  console.log("Respuesta OpenAI:", text);

  // Mantengo el mismo tipo de retorno que antes (ChatMessage)
  return { role: "assistant", content: text };
}
