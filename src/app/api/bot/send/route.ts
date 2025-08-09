import type { FormData } from "@/types/types";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const formData = requestData as FormData;
    const phone = process.env.WS_NUMBER;
    
    if (!phone) throw new Error("WS_NUMBER no configurado");
    
    // Determinar el mensaje a enviar
    const messageBody = requestData.testQuestion 
      ? requestData.testQuestion  // Si viene una pregunta específica (testeo masivo)
      : `Test desde ${formData.urlEasyPanel} - Email: ${formData.emailTester}`; // Mensaje por defecto
    
    // Construir payload del bot usando los datos del formulario
    const payload = {
      location: { id: formData.locationId },
      phone,
      contact_id: formData.contactId,
      message: { 
        body: messageBody
      }
    };
    
    // Post al bot externo con el payload (formData)
    const res = await fetch(formData.urlEasyPanel, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json().catch(() => ({}));
    const result = { ok: res.ok, status: res.status, data };
    
    return Response.json(result);
  } catch {
    return Response.json({ ok: false, status: 500, data: { error: "Error del servidor" } });
  }
}
