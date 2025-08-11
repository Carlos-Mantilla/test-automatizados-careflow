"use client";

import React, { RefObject } from "react";
import { formatDuration } from "@/helpers/timeUtils";
import DynamicToolTip from "@/app/components/dynamicToolTip";

export interface SummaryData {
  total: number;
  completed: number;
  successful: number;
  failed: number;
  successRate: number;
  categoryCounts: Record<string, number>;
  duration: number;
}

export interface SummarySectionProps {
  summary: SummaryData | null;
  summaryRef: RefObject<HTMLDivElement | null>;
}

export default function SummarySection({ summary, summaryRef }: SummarySectionProps) {
  if (!summary) return null;

  return (
    <section ref={summaryRef as RefObject<HTMLDivElement>} className="border border-black/10 dark:border-white/15 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">📊 Resumen del Test</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{summary.completed}/{summary.total}</div>
          <div className="text-sm text-blue-600">Completadas</div>
        </div>

        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{summary.successful}</div>
          <div className="text-sm text-green-600">Exitosos</div>
        </div>

        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
          <div className="text-sm text-red-600">Fallidos</div>
        </div>

        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{summary.successRate}%</div>
          <div className="text-sm text-yellow-600">Éxito</div>
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
        Duración total: {formatDuration(summary.duration)}
      </div>
    </section>
  );
}


