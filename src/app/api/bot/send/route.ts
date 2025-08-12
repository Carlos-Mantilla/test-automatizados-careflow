import type { TestFormData } from "@/types/types";

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const testFormData = requestData as TestFormData;
    const phone = process.env.WS_NUMBER;
    
    if (!phone) throw new Error("WS_NUMBER no configurado");
    
    // Determinar el mensaje a enviar
    const messageBody = requestData.testQuestion 
      ? requestData.testQuestion  // Si viene una pregunta específica (testeo masivo)
      : `Test desde ${testFormData.urlEasyPanel}`; // Mensaje por defecto
    
    // Construir payload del bot usando los datos del formulario
    const payload = {
      location: { id: testFormData.locationId },
      phone,
      contact_id: testFormData.contactId,
      message: { 
        body: messageBody
      }
    };
    
    // Post al bot externo con el payload (testFormData)
    const res = await fetch(testFormData.urlEasyPanel, {
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
