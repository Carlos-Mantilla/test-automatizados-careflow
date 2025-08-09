import "server-only";

export const DEFAULT_BOT_ENDPOINT =
  process.env.BOT_ENDPOINT ||
  "https://n8n-gotiger-bot-esdras-gliobot.fevig1.easypanel.host/gliohealth";

export interface MinimalBotPayload {
  location: { id: string };
  phone: string;
  contact_id: string;
  message: { body: string };
}

// Envía POST al bot con los datos que le pases
export async function postToBot(data?: Partial<MinimalBotPayload>) {
  const payload = {
    location: { id: data?.location?.id ?? "odQon2KjVfTD1ubFdwBK" },
    phone: data?.phone ?? "+573019505508",
    contact_id: data?.contact_id ?? "3oLF4VLMplbFH0fQmgKF",
    message: { body: data?.message?.body ?? "Hola soy un test" }
  };

  try {
    const res = await fetch(DEFAULT_BOT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 500, data: { error: "Error de conexión" } };
  }
}
