/**
 * Lógica para envío de datos del formulario al bot y respuesta del bot
 */

import { validateForm } from "./validation";
import type { FormData, TestResult } from "@/types/types";

/**
 * Ejecuta el testeo enviando los datos del formulario al bot
 * @param formData - Datos del formulario de testeo
 * @returns Resultado del testeo
 */
export async function sendToModel(formData: FormData): Promise<TestResult> {
  // 1) Validación básica de campos
  const { isValid, errors } = validateForm(
    formData.urlEasyPanel,
    formData.contactId,
    formData.locationId,
    formData.emailTester
  );

  if (!isValid) {
    return {
      success: false,
      message: `❌ Errores de validación: ${errors.join(" | ")}`,
    };
  }

  try {
    // 2) Enviar datos del formulario directamente al API
    const response = await fetch("/api/bot/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // 3) Retornar resultado  
    const messageBody = `Test desde ${formData.urlEasyPanel} - Email: ${formData.emailTester}`;
    
    return {
      success: data.ok,
      message: data.ok 
        ? "Testeo enviado al bot correctamente ✅" 
        : `❌ Error en testeo (${data.status ?? "desconocido"})`,
      data,
      messageBody,
      botResponse: data
    };

  } catch (error) {
    console.error("Error en testeo:", error);
    return {
      success: false,
      message: "❌ Error de conexión con el bot",
    };
  }
}
