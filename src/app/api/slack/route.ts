export async function POST(req: Request) {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    // Validar que la URL del webhook esté configurada
    if (!webhookUrl) {
      throw new Error("N8N_WEBHOOK_URL no configurado");
    }

    // Obtener el payload del request
    const payload = await req.json();

    // Validar que el payload tenga la estructura esperada
    if (
      !payload ||
      !payload.metadata ||
      !payload.metricasTesteo ||
      !payload.resultados
    ) {
      throw new Error("Payload inválido: estructura requerida no encontrada");
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error n8n (${res.status}): ${errorText}`);
    }

    // n8n puede devolver texto en lugar de JSON
    const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    
    console.log("Reporte enviado exitosamente a n8n", data);
    
    // Enviar email con el resultado cuando n8n responda con el texto enviado a SLACK
    try {
      const emailResponse = await fetch(`${req.headers.get('origin') || 'http://localhost:3000'}/api/maileroo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          n8nResponse: data,
          clientName: payload.metadata.nombreCliente,
        }),
      });
      
      if (emailResponse.ok) {
        console.log("Email enviado exitosamente");
      } else {
        console.error("Error enviando email:", await emailResponse.text());
      }
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
    }
    
    return Response.json({ success: true, data });
  } catch (err) {
    console.error("❌ Error enviando reporte a Slack:", err);
    return Response.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
