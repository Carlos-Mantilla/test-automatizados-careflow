"use client";

import React, { RefObject } from "react";
import { formatDuration } from "@/helpers/timeUtils";
import DynamicToolTip from "@/app/components/dynamicToolTip";
import type { QuestionTestResult, TestFormData } from "@/types/types";

export interface SummaryData {
  // Metricas de llamadas a EasyPanel
  total: number;
  completed: number;
  successful: number;
  failed: number;
  successRate: number;
  // Métricas por veredicto del árbitro
  arbiterCorrect?: number;
  arbiterIncorrect?: number;
  arbiterDecided?: number;
  arbiterSuccessRate?: number;
  // Sumario de categorias
  categoryCounts: Record<string, number>;
  duration: number;
}

export interface SummarySectionProps {
  summary: SummaryData | null;
  summaryRef: RefObject<HTMLDivElement | null>;
  results?: QuestionTestResult[];
  testFormData: TestFormData;
}

export default function SummarySection({ summary, summaryRef, results = [], testFormData }: SummarySectionProps) {
  if (!summary) return null;

  // Obtener el nombre del cliente de la URL EasyPanel
  const clientName = testFormData.urlEasyPanel.split("host/")[1];
  // Convierte tiempo de testeo en minutos/segundos
  const formattedDuration = formatDuration(summary.duration);

  return (
    <section ref={summaryRef as RefObject<HTMLDivElement>} className="border border-black/10 dark:border-white/15 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">📊 Metricas de Testeo</h3>

      {/* Controles de descarga */}
      {results.length > 0 && (
        <div className="flex justify-center gap-3 mb-4 animate-pulse active:scale-95 transition-all duration-100">
          <button
            type="button"
            className="px-3 py-1.5 text-sm rounded bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              // Crear estructura personalizada del JSON
              const customPayload = {
                metadata: {
                  nombreCliente: clientName,
                  fechaHora: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }) + " (Mexico_City)",
                  urlEasyPanel: testFormData.urlEasyPanel,
                  locationId: testFormData.locationId,
                  contactId: testFormData.contactId,
                  totalPreguntas: summary.total,
                  preguntasCompletadas: summary.completed,
                  duracionTest: formattedDuration,
                },
                metricasTesteo: {
                  llamadasHTTP: {
                    total: summary.total,
                    completadas: summary.completed,
                    exitosas: summary.successful,
                    fallidas: summary.failed,
                    tasaExito: summary.successRate,
                  },
                  resultadoTest: {
                    correctas: summary.arbiterCorrect ?? 0,
                    incorrectas: summary.arbiterIncorrect ?? 0,
                    evaluadas: summary.arbiterDecided ?? 0,
                    tasaExito: summary.arbiterSuccessRate ?? 0,
                  },
                  categorias: summary.categoryCounts,
                },
                resultados: results.map(result => ({
                  id: result.questionId,
                  pregunta: result.question,
                  respuestaEsperada: result.expectedResponse,
                  respuestaBot: result.actualResponse,
                  veredicto: result.arbiterVerdict === "1" ? "✅" : "❌",
                  fechaHora: result.timestamp,
                })),
              };

              const blob = new Blob([JSON.stringify(customPayload, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${clientName}-test-${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Descargar JSON
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Columna izquierda: Llamadas EasyPanel */}
        <div>
          <h4 className="font-medium mb-2 text-center text-gray-400">Llamadas a EasyPanel 🌐</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{summary.completed}/{summary.total}</div>
              <div className="text-sm text-blue-600">Completadas</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{summary.successRate}%</div>
              <div className="text-sm text-yellow-600">Éxito HTTP</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.successful}</div>
              <div className="text-sm text-green-600">HTTP 200</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-red-600">Errores</div>
            </div>
          </div>
        </div>

        {/* Columna derecha: Veredicto del test (árbitro) */}
        <div>
          <h4 className="font-medium mb-2 text-center text-gray-400">Veredicto del test (Árbitro ✋🏼)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{summary.arbiterDecided ?? 0}</div>
              <div className="text-sm text-blue-600">Evaluadas</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{summary.arbiterSuccessRate ?? 0}%</div>
              <div className="text-sm text-yellow-600">Éxito Árbitro</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.arbiterCorrect ?? 0}</div>
              <div className="text-sm text-green-600">Correctas ✅</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{summary.arbiterIncorrect ?? 0}</div>
              <div className="text-sm text-red-600">Incorrectas ❌</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <h4 className="font-medium">Distribución por categorías:</h4>
          <DynamicToolTip />
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(summary.categoryCounts).map(([category, count]) => (
            <span key={category} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
              {category}: {count}
            </span>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Duración total: {formattedDuration}
      </div>
    </section>
  );
}


