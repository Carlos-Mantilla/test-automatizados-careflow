import { arbiterAgent } from "@/openai";
import type { ChatMessage } from "@/types/types";

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    if (!Array.isArray(messages)) {
      return Response.json({ error: "messages inválido" }, { status: 400 });
    }
    const reply = await arbiterAgent(messages);
    return Response.json({ message: reply });
  } catch (err) {
    console.error("Error /api/arbiterAgent:", err);
    return Response.json({ error: "Fallo en el servidor" }, { status: 500 });
  }
}