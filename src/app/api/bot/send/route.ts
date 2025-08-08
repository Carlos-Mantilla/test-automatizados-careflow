import { sendMinimalBotPost, type MinimalBotPayload } from "@/lib/botApi";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<MinimalBotPayload>;
    const result = await sendMinimalBotPost(body);
    return Response.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = await sendMinimalBotPost();
  return Response.json(result, { status: result.ok ? 200 : 500 });
}
