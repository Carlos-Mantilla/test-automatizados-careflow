"use client";

import { useEffect, useRef, useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useBotTesting } from "@/hooks/useBotTesting";
import { useBatchTesting } from "@/hooks/useBatchTesting";
import { scrollToBottom, addChatMessage, addMultipleMessages, createTestingMessages } from "@/helpers/chatUtils";
import { testQuestionsData } from "@/data";
import type { ChatMessage } from "@/types/types";

// Este tipo se movió a chatUtils.ts - ya no es necesario aquí

export default function Home() {
  // Estado de los inputs del formulario superior
  const [urlEasyPanel, setUrlEasyPanel] = useState("");
  const [contactId, setContactId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [emailTester, setEmailTester] = useState("");

  // Historial del chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Modo de testeo: individual vs masivo
  const [isBatchMode, setIsBatchMode] = useState(false);

  // Custom hooks
  const { isRunning, formattedTime, start, reset, cleanup } = useTimer();
  const { executeTest } = useBotTesting();
  const { progress, summary, executeBatchTest, resetBatchTest, isRunning: isBatchRunning } = useBatchTesting();

  // Referencia para scroll automático
  const chatRef = useRef<HTMLDivElement | null>(null);

  // Efecto: hace scroll al final cada vez que llegan nuevos mensajes
  useEffect(() => {
    scrollToBottom(chatRef);
  }, [messages]);

  // Cleanup del timer al desmontar el componente
  useEffect(() => {
    return cleanup;
  }, [cleanup]);


  // Maneja el proceso de testeo individual
  async function handleformDataToBot() {
    // 1) Mensaje de inicio
    setMessages((prev) => addChatMessage(prev, "system", "Iniciando testeo individual..."));

    // 2) Ejecutar testeo usando el hook
    const result = await executeTest({
      urlEasyPanel,
      contactId,
      locationId,
      emailTester,
    });

    // 3) Agregar todos los mensajes resultado del testeo
    const testingMessages = createTestingMessages(result);
    setMessages((prev) => addMultipleMessages(prev, testingMessages));

    // 4) Log para debugging
    if (result.botResponse) {
      console.log("Respuesta del bot (completa):", result.botResponse);
    }
  }

  // Maneja el proceso de testeo masivo
  async function handleBatchTesting() {
    // 1) Mensaje de inicio
    setMessages((prev) => addChatMessage(prev, "system", `Iniciando testeo masivo: ${testQuestionsData.length} preguntas...`));

    try {
      // 2) Ejecutar testeo masivo
      await executeBatchTest(testQuestionsData, {
        urlEasyPanel,
        contactId,
        locationId,
        emailTester,
      });

      // 3) Mensaje de finalización
      setMessages((prev) => addChatMessage(prev, "system", "✅ Testeo masivo completado. Ver resumen más abajo."));

    } catch (error) {
      console.error("Error en testeo masivo:", error);
      setMessages((prev) => addChatMessage(prev, "system", "❌ Error en testeo masivo"));
    }
  }

  // Efecto para mostrar preguntas y respuestas en tiempo real durante testeo masivo
  useEffect(() => {
    if (isBatchMode && progress.completed.length > 0) {
      const lastResult = progress.completed[progress.completed.length - 1];
      
      // Agregar la pregunta y respuesta al chat
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            role: "user" as const,
            content: `[${lastResult.questionId}] ${lastResult.question}`
          },
          {
            role: "assistant" as const,
            content: lastResult.actualResponse
          }
        ];
        return newMessages;
      });
    }
  }, [progress.completed.length, isBatchMode]);



  // Controla el botón: inicia el temporizador y lanza la llamada; o bien detiene y resetea
  function handleStart(): void {
    const currentlyRunning = isRunning || isBatchRunning;
    
    if (!currentlyRunning) {
      reset(); // resetear antes de empezar
      resetBatchTest(); // resetear testeo masivo
      start(); // iniciar timer
      
      // Ejecutar el tipo de testeo según el modo
      if (isBatchMode) {
        void handleBatchTesting(); // testeo masivo
      } else {
        void handleformDataToBot(); // testeo individual
      }
      return;
    }
    
    // Parar y resetear todo
    reset(); 
    resetBatchTest();
  }

  return (
    <main className="min-h-screen w-full px-6 py-8 md:px-10">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        {/* Encabezado */}
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Testeo Automático Bots
          </h1>
        </header>

        {/* Toggle de modo de testeo */}
        <section className="flex items-center justify-between border border-black/10 dark:border-white/15 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Modo de testeo:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="testMode"
                checked={!isBatchMode}
                onChange={() => setIsBatchMode(false)}
                className="text-blue-600"
              />
              <span className="text-sm">Individual (1 mensaje)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="testMode"
                checked={isBatchMode}
                onChange={() => setIsBatchMode(true)}
                className="text-blue-600"
              />
              <span className="text-sm">Masivo ({testQuestionsData.length} preguntas)</span>
            </label>
          </div>
          
          {/* Progreso del testeo masivo */}
          {isBatchMode && progress.total > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progreso: {progress.current}/{progress.total} 
              {progress.current > 0 && (
                <span className="ml-2">
                  ({Math.round((progress.current / progress.total) * 100)}%)
                </span>
              )}
            </div>
          )}
        </section>

        {/* Inputs superiores */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">URL EasyPanel</label>
            <input
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="https://..."
              value={urlEasyPanel}
              onChange={(e) => setUrlEasyPanel(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Contact_ID</label>
            <input
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="12345"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Location_ID</label>
            <input
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="abc-001"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email Tester</label>
            <input
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30"
              placeholder="tester@dominio.com"
              type="email"
              value={emailTester}
              onChange={(e) => setEmailTester(e.target.value)}
            />
          </div>
        </section>

        {/* Chat */}
        <section className="rounded-xl border border-black/10 dark:border-white/15 overflow-hidden">
          <div ref={chatRef} className="h-[360px] overflow-y-auto bg-black/[.03] dark:bg-white/[.03] p-4 space-y-2">
            {messages.length === 0 ? (
              <p className="text-sm text-foreground/70">Aquí aparecerá el chat...</p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`text-sm leading-6 p-3 rounded-lg mb-2 ${m.role === "user"
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                      : m.role === "system"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500"
                        : "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                    }`}
                >
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
                  <span
                    className={
                      m.role === "user"
                        ? "text-blue-900 dark:text-blue-100"
                        : m.role === "system"
                          ? "text-yellow-900 dark:text-yellow-100"
                          : "text-green-800 dark:text-green-100 "
                    }
                  >
                    {m.content}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Pie del chat: botón de control y temporizador */}
          <div className="flex items-center justify-center gap-4 border-t border-black/10 dark:border-white/15 px-4 py-3">
            {/* Botón de control */}
            <button
              type="button"
              onClick={handleStart}
              className={`inline-flex items-center justify-center rounded-md text-white px-4 py-2 text-sm font-bold cursor-pointer w-20 active:scale-95 transition-all duration-100 ${(isRunning || isBatchRunning) ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {(isRunning || isBatchRunning) ? "Stop" : "Iniciar"}
            </button>
            {/* Contador de tiempo */}
            <div className="text-sm font-semibold tabular-nums text-yellow-400 border border-gray-400 p-1.5 rounded-md">
              {formattedTime}
            </div>
          </div>
        </section>

        {/* Resumen del testeo masivo */}
        {isBatchMode && summary && (
          <section className="border border-black/10 dark:border-white/15 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">📊 Resumen del Testeo Masivo</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                <div className="text-sm text-blue-600">Total</div>
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

            {/* Distribución por categorías */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Distribución por categorías:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(summary.categoryCounts).map(([category, count]) => (
                  <span 
                    key={category}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                  >
                    {category}: {count}
                  </span>
                ))}
              </div>
            </div>

            {/* Duración */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Duración total: {Math.round(summary.duration / 1000)}s
            </div>
          </section>
        )}

        {/* Lista detallada de resultados del testeo masivo */}
        {isBatchMode && progress.completed.length > 0 && (
          <section className="border border-black/10 dark:border-white/15 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">📋 Resultados Detallados ({progress.completed.length})</h3>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {progress.completed.map((result) => (
                <div 
                  key={result.questionId}
                  className={`p-3 rounded-lg border-l-4 ${result.success 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{result.questionId}</span>
                    <span className={`text-xs px-2 py-1 rounded ${result.success 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {result.success ? 'Éxito' : 'Error'}
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div><strong>P:</strong> {result.question}</div>
                    <div><strong>Bot:</strong> {result.actualResponse}</div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                        Ver respuesta esperada
                      </summary>
                      <div className="mt-1 text-gray-600 text-xs">
                        <strong>Esperada:</strong> {result.expectedResponse}
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
