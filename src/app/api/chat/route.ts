import { chatComplete, ChatMessage } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    if (!Array.isArray(messages)) {
      return Response.json({ error: "messages inválido" }, { status: 400 });
    }
    const reply = await chatComplete(messages);
    return Response.json({ message: reply });
  } catch (err) {
    console.error("Error /api/chat:", err);
    return Response.json({ error: "Fallo en el servidor" }, { status: 500 });
  }
}