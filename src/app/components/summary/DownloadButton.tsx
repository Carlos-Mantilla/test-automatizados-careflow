"use client";

import React from "react";
import type { SummaryButtonProps } from "@/types/types";
import { generateTestReportPayload } from "@/helpers/JSONbuttonData";

export default function DownloadButton({ summary, results, testFormData, formattedTime }: SummaryButtonProps) {
  const handleDownload = () => {
    // Generar payload usando el helper centralizado
    const customPayload = generateTestReportPayload(summary, results, testFormData, formattedTime);

    const blob = new Blob([JSON.stringify(customPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${customPayload.metadata.nombreCliente}-test-${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer shadow-md shadow-gray-600 animate-pulse active:scale-95 transition-all duration-100"
      onClick={handleDownload}
    >
      Descargar JSON
    </button>
  );
}
