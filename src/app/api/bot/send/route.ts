import { postToBot, type MinimalBotPayload } from "@/lib/botApi";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as Partial<MinimalBotPayload>;
    const result = await postToBot(body);
    return Response.json(result);
  } catch {
    return Response.json({ ok: false, status: 500, data: { error: "Error del servidor" } });
  }
}
