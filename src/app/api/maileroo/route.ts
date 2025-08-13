export async function POST(req: Request) {
  try {
    const apiKey = process.env.MAILEROO_API_KEY;

    // Validar que la API key esté configurada
    if (!apiKey) {
      throw new Error("MEILEROO_API_KEY no configurado");
    }

    const fromAddress = "careflow@3be0801866849462.maileroo.org"; // dominio gratis de maileroo
    const toAddress = "sergiog@starassistants.com";

    const res = await fetch("https://smtp.maileroo.com/api/v2/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: {
          address: fromAddress,
          display_name: "soy el test de nextjs",
        },
        to: {
          address: toAddress,
          display_name: "Sergio",
        },
        subject: "soy el titulo del email",
        plain: "texto plano aqui",
        html: "<p>texto html a enviar</p>",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error Maileroo (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    console.log("Email enviado con éxito", data);
    return Response.json({ success: true, data });
   
  } catch (err) {
    console.error("❌ Error enviando email:", err);
    return { success: false, error: (err as Error).message };
  }
}
