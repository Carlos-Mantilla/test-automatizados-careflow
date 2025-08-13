"use client";

import React, { RefObject, useEffect } from "react";
import type { ChatMessage } from "@/types/types";
import DynamicToolTip from "@/app/components/dynamicToolTip";
import { scrollToBottom } from "@/helpers/chatUtils";

export interface ChatSectionProps {
  messages: ChatMessage[];
  chatRef: RefObject<HTMLDivElement | null>;
  progressCurrent: number;
  progressTotal: number;
  isBatchRunning: boolean;
  onStartClick: () => void;
  formattedTime: string;
}

export default function ChatSection(props: ChatSectionProps) {
  const { messages, chatRef, progressCurrent, progressTotal, isBatchRunning, onStartClick, formattedTime } = props;

  // Auto-scroll al final cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom(chatRef);
  }, [messages, chatRef]);

  return (
    <section className="rounded-xl border border-black/10 dark:border-white/15 overflow-hidden">
      {/* Área de mensajes del chat - scrolleable */}
      <div ref={chatRef as RefObject<HTMLDivElement>} className="h-[700px] overflow-y-auto bg-black/[.03] dark:bg-white/[.03] p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-sm text-foreground/70 text-center">Aquí aparecerá el progreso del testeo...</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`text-sm leading-6 p-1.5 rounded-lg ${m.role === "user"
                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                : m.role === "system"
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500"
                  : "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                }`}
            >

              {/* CONTENIDO DEL MENSAJE: Texto + Respuesta esperada (si existe) */}
              <div>
                <div>
                  <span
                    className={`font-semibold ${m.role === "user"
                      ? "text-blue-900 dark:text-blue-300"
                      : m.role === "system"
                        ? "text-yellow-700 dark:text-yellow-300"
                        : "text-green-700 dark:text-green-300"
                      }`}
                  >
                    {m.role === "user" ? "Tú: " : m.role === "system" ? "Sistema 🚨: " : "Bot 🤖: "}
                  </span>
                  {/* contenido del mensaje */}
                  {m.content}
                </div>
                {m.expectedResponse && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex justify-between items-center">
                      <span>Ver respuesta esperada</span>
                      {/* hora del mensaje */}
                      {m.timestamp && (
                        <span className="text-[10px] italic opacity-70 ml-auto mr-1">
                          {m.timestamp}
                        </span>
                      )}
                      {/* Veredicto del árbitro: ❌ = incorrecto, ✅ = correcto */}
                      {m.role === "assistant" && m.arbiterVerdict === "0" && <span className="not-italic text-2xl">❌</span>}
                      {m.role === "assistant" && m.arbiterVerdict === "1" && <span className="not-italic text-2xl">✅</span>}
                    </summary>
                    <div className="mt-1 text-gray-600 dark:text-gray-400 text-xs">
                      <strong>Esperada:</strong> {m.expectedResponse}
                    </div>
                  </details>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Progreso */}
      <section className="flex items-center justify-center gap-x-6 border border-black/10 dark:border-white/15 rounded-lg p-2 text-gray-600 dark:text-yellow-400 text-sm font-semibold">
        <div className="flex items-center gap-x-1">
          Tipos:<DynamicToolTip />
        </div>

        {progressTotal > 0 && (
          <div className="flex items-center gap-2">
            {isBatchRunning && (
              <span className="inline-block h-3 w-3 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" aria-label="cargando"></span>
            )}
            <span>
              Progreso: {progressCurrent}/{progressTotal}
            </span>
            {progressCurrent > 0 && (
              <span className="ml-2">
                ({Math.round((progressCurrent / progressTotal) * 100)}%)
              </span>
            )}
          </div>
        )}
      </section>

      {/* Pie: botón y timer */}
      <div className="flex items-center justify-center gap-4 border-t border-black/10 dark:border-white/15 px-4 py-3">
        <button
          type="button"
          onClick={onStartClick}
          className={`inline-flex items-center justify-center rounded-md text-white px-4 py-2 text-sm font-bold cursor-pointer w-20 active:scale-95 transition-all duration-100 ${isBatchRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          {isBatchRunning ? "STOP" : "INICIAR"}
        </button>

        <div className="text-sm font-semibold tabular-nums text-yellow-400 border border-gray-400 p-1.5 rounded-md">
          {formattedTime}
        </div>
      </div>
    </section>
  );
}


