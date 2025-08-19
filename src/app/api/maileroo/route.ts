import { extractEmailData, type EmailData } from "@/helpers/mailerooUtils";

export async function POST(req: Request): Promise<Response> {
  try {
    const apiKey = process.env.MAILEROO_API_KEY;

    // Validar que la API key esté configurada
    if (!apiKey) {
      throw new Error("MEILEROO_API_KEY no configurado");
    }

    // Obtener todo el payload del request
    const requestBody = await req.json();
    console.log("NO procesado:", requestBody);

    // Validar que se proporcione la respuesta de n8n
    if (!requestBody.n8nResponse) {
      throw new Error("Respuesta de n8n no proporcionada");
    }

    // Extraer todos los datos del texto de n8n (utils Function)
    const emailData: EmailData = extractEmailData(requestBody.n8nResponse);
    console.log("Procesado", emailData);

    const fromAddress = "careflow@3be0801866849462.maileroo.org"; // dominio gratis de maileroo
    const toAddress = "it@starassistants.com";

    const res = await fetch("https://smtp.maileroo.com/api/v2/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: {
          address: fromAddress,
          display_name: "auto-testing Careflow",
        },
        to: {
          address: toAddress,
          display_name: "AI Team",
        },
        subject: `auto-testing Careflow: ${emailData.clientName || "Cliente"}`,
        plain: emailData.cleanedResponse,
        html: `
           <!DOCTYPE html>
           <html>
           <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>Resultado Auto-Testing</title>
           </head>
           <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
             
             <!-- ==================== HEADER SECTION ==================== -->
             <div style="background: linear-gradient(135deg, #67dcffff 0%, #ff66c4ff 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
               <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">
                 🤖 Auto-Testing Report
               </h1>
               <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                 Nuevo reporte de testeo automático generado
               </p>
             </div>

             <!-- ==================== MAIN CONTENT CONTAINER ==================== -->
             <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
               
               <!-- ==================== CLIENT INFORMATION SECTION ==================== -->
               <div style="margin-bottom: 25px;">
                 <h2 style="color: #2c3e50; border-bottom: 2px solid #67dcffff; padding-bottom: 10px; margin-bottom: 20px;">
                   📋 Información del Cliente
                 </h2>
                 <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; border-left: 4px solid #67dcffff;">
                                       <p style="margin: 8px 0; font-size: 16px; line-height: 1.5;"><strong>Cliente:</strong> <span style="color: #ff66c4ff; font-weight: bold; font-size: 16px;">${
                                         emailData.clientName || "N/A"
                                       }</span></p>
                   <p style="margin: 8px 0; font-size: 16px; line-height: 1.5;"><strong>Fecha:</strong> <span style="font-size: 16px;">${new Date().toLocaleString(
                     "es-MX",
                     { timeZone: "America/Mexico_City" }
                   )}</span></p>
                 </div>
               </div>

               <!-- ==================== TESTING METRICS SECTION ==================== -->
               <div style="margin-bottom: 25px;">
                 <h2 style="color: #2c3e50; border-bottom: 2px solid #67dcffff; padding-bottom: 10px; margin-bottom: 20px;">
                   📊 Métricas del Testeo
                 </h2>
                 <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; border-left: 4px solid #67dcffff;">
                   <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                     <!-- DURATION METRIC CARD -->
                     <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                       <div style="font-size: 24px; font-weight: bold; color: #67dcffff;">⏱️</div>
                       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">Duración</div>
                                               <div style="color: #7f8c8d; font-size: 16px; font-weight: bold; margin-top: 8px;">${
                                                 emailData.duration
                                               }</div>
                     </div>
                     <!-- SUCCESS METRIC CARD -->
                     <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
                       <div style="font-size: 24px; font-weight: bold; color: #ff66c4ff;">🎯</div>
                       <div style="font-size: 18px; font-weight: bold; color: #2c3e50;">Éxito</div>
                                               <div style="color: #7f8c8d; font-size: 16px; font-weight: bold; margin-top: 8px;">${
                                                 emailData.successRate
                                               }</div>
                     </div>
                   </div>
                 </div>
               </div>

                   <!-- ==================== DOWNLOAD SECTION ==================== -->
               <div style="margin-bottom: 25px;">
                 <h2 style="color: #2c3e50; border-bottom: 2px solid #67dcffff; padding-bottom: 10px; margin-bottom: 20px;">
                   📥 Descargar Reporte
                 </h2>
                 <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; border-left: 4px solid #67dcffff; text-align: center;">
                                       ${(() => {
                                         if (emailData.downloadUrl) {
                                           return `
                          <a href="${emailData.downloadUrl}" 
                             style="display: inline-block; background: linear-gradient(135deg, #67dcffff 0%, #ff66c4ff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease;">
                            📄 Descargar JSON Completo
                          </a>
                        `;
                                         }

                                         // Debug: mostrar qué URL se encontró
                                         console.log(
                                           "URL de descarga encontrada:",
                                           emailData.downloadUrl
                                         );
                                         return '<p style="color: #7f8c8d;">Enlace de descarga no disponible</p>';
                                       })()}
                 </div>
               </div>

               <!-- ==================== COMPLETE DETAILS SECTION ==================== -->
               <div style="margin-bottom: 25px;">
                 <h2 style="color: #2c3e50; border-bottom: 2px solid #ff66c4ff; padding-bottom: 10px; margin-bottom: 20px;">
                   📄 Detalles del Testeo
                 </h2>
                 <div style="background: #fff0f5; padding: 20px; border-radius: 8px; border-left: 4px solid #ff66c4ff;">
                                       <pre style="font-family: 'Courier New', monospace; font-size: 16px; line-height: 1.5; margin: 0; white-space: pre-wrap; color: #2c3e50; background: white; padding: 15px; border-radius: 6px; border: 1px solid #ecf0f1;">${
                                         emailData.cleanedResponse
                                       }</pre>
                 </div>
               </div>

               <!-- ==================== FOOTER SECTION ==================== -->
               <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #ecf0f1;">
                 <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                   Este reporte fue generado automáticamente por el sistema de Auto-Testing de Careflow
                 </p>
                 <p style="color: #7f8c8d; font-size: 12px; margin: 5px 0 0 0;">
                   📧 Enviado desde auto-testing Careflow
                 </p>
               </div>

             </div>

           </body>
           </html>
         `,
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
    return Response.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
