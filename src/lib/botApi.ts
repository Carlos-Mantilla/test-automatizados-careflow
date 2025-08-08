import "server-only";

const DEFAULT_ENDPOINT =
  process.env.BOT_ENDPOINT ||
  "https://n8n-gotiger-bot-esdras-gliobot.fevig1.easypanel.host/gliohealth";

export type BotPostResult = {
  ok: boolean;
  endpoint: string;
  payload: unknown;
  response?: unknown;
  status?: number;
  error?: string;
};

export interface MinimalBotPayload {
  location: { id: string };
  phone: string;
  contact_id: string;
  message: { body: string };
}

export async function sendMinimalBotPost(
  overrides?: Partial<MinimalBotPayload>,
  endpoint: string = DEFAULT_ENDPOINT
): Promise<BotPostResult> {
  const payload: MinimalBotPayload = {
    location: { id: "odQon2KjVfTD1ubFdwBK" },
    phone: "+573019505508",
    contact_id: "3oLF4VLMplbFH0fQmgKF",
    message: { body: "que servicios tienes?" },
    ...(overrides ? { ...overrides, location: { id: overrides.location?.id || "odQon2KjVfTD1ubFdwBK" } } : {}),
  } as MinimalBotPayload;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, endpoint, payload, response: data, status: res.status };
    }
    return { ok: true, endpoint, payload, response: data, status: res.status };
  } catch (error) {
    return {
      ok: false,
      endpoint,
      payload,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
