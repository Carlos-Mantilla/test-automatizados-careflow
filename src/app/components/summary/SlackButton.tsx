"use client";

import React from "react";
import type { SummaryButtonProps } from "@/types/types";
import { generateTestReportPayload } from "@/helpers/JSONbuttonData";

export default function SendToSlackButton({ summary, results, testFormData, formattedTime }: SummaryButtonProps) {
  const handleSendToSlack = async () => {
    // Generar payload usando el helper centralizado
    const customPayload = generateTestReportPayload(summary, results, testFormData, formattedTime);

    // Pedir confirmación antes de enviar
    const confirmar = window.confirm(
      `¿Estás seguro de que quieres enviar el reporte de testeo a Slack/Email?\n\n` +
      `Cliente: ${customPayload.metadata.nombreCliente}\n` +
      `Preguntas: ${summary.completed}/${summary.total}\n` +
      `Duración: ${formattedTime}`
    );

    if (confirmar) {
      try {
        // Enviar el JSON a través de nuestro endpoint de API
        const response = await fetch('/api/slack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customPayload),
        });

        const result = await response.json();

        if (result.success) {
          alert('✅ Reporte enviado exitosamente a Slack/Email');
        } else {
          throw new Error(result.error || 'Error desconocido');
        }
      } catch (error) {
        console.error('Error enviando a Slack/Email:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert(`❌ Error al enviar: ${errorMessage}`);
      }
    }
  };

  return (
    <button
      type="button"
      className="px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-600 cursor-pointer shadow-md shadow-purple-500 animate-pulse active:scale-95 transition-all duration-100"
      onClick={handleSendToSlack}
    >
      Enviar JSON a Slack/Email
    </button>
  );
}
