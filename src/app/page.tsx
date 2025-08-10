"use client";

import { useEffect, useRef, useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useBotTesting } from "@/hooks/useBotTesting";
import { useBatchTesting } from "@/hooks/useBatchTesting";
import { scrollToBottom, addChatMessage, addMultipleMessages, createTestingMessages } from "@/helpers/chatUtils";
import { formatDuration } from "@/helpers/timeUtils";
import { testQuestionsData } from "@/data";
import type { ChatMessage } from "@/types/types";
import { validateForm } from "@/helpers/validationForm";
import DynamicToolTip from "@/app/components/dynamicToolTip";

// Este tipo se movió a chatUtils.ts - ya no es necesario aquí

export default function Home() {
  // Estado de los inputs del formulario superior
  const [urlEasyPanel, setUrlEasyPanel] = useState("");
  const [contactId, setContactId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [emailTester, setEmailTester] = useState("");
  // Errores por campo para resaltar UI
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<
    "urlEasyPanel" | "contactId" | "locationId" | "emailTester",
    string
  >>>({});

  // Historial del chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Modo de testeo: individual vs masivo
  const [isBatchMode, setIsBatchMode] = useState(true);

  // Custom hooks
  const { isRunning, formattedTime, start, reset, cleanup } = useTimer();
  const { executeTest } = useBotTesting();
  const { progress, summary, executeBatchTest, resetBatchTest, stopBatchTest, isRunning: isBatchRunning } = useBatchTesting();

  // Referencias para scroll automático
  const chatRef = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  // Evitar duplicar mensajes cuando llega el mismo progreso
  const lastRenderedCountRef = useRef<number>(0);

  // Efecto: hace scroll al final cada vez que llegan nuevos mensajes
  useEffect(() => {
    scrollToBottom(chatRef);
  }, [messages]);

  // Nota: el scroll al resumen ahora se dispara explícitamente
  // tras el mensaje de "Testeo masivo completado" para asegurar
  // que la última solicitud haya finalizado y el DOM esté pintado.

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
      setMessages((prev) => addChatMessage(prev, "system", "Testeo masivo completado. Ver resumen más abajo. ✅"));
      // 3.1) Detener/Resetear timer para que el botón vuelva a "INICIAR"
      reset();
      // 4) Scroll controlado al resumen (asegura DOM actualizado)
      setTimeout(() => {
        if (summaryRef.current) {
          summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);

    } catch (error) {
      console.error("Error en testeo masivo:", error);
      setMessages((prev) => addChatMessage(prev, "system", "Error en testeo masivo ❌"));
      // Asegurar que el botón vuelva a INICIAR también en error
      reset();
    }
  }

  // Efecto para mostrar preguntas y respuestas en tiempo real durante testeo masivo
  useEffect(() => {
    if (!isBatchMode) return;
    const count = progress.completed.length;
    if (count === 0) return;
    // Evitar duplicados: solo procesar cuando aumenta el número de completadas
    if (count <= lastRenderedCountRef.current) return;

    const lastResult = progress.completed[count - 1];
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `[${lastResult.questionId}] ${lastResult.question}`, timestamp: now },
      { role: "assistant", content: lastResult.actualResponse, expectedResponse: lastResult.expectedResponse, timestamp: now }
    ]);

    lastRenderedCountRef.current = count;
  }, [progress.completed, isBatchMode, progress.total]);



  // Controla el botón: inicia el temporizador y lanza la llamada; o bien detiene y resetea
  function handleStart(): void {
    const currentlyRunning = isRunning || isBatchRunning;

    if (!currentlyRunning) {
      // Validación previa de formulario para ambos modos
      const { isValid, errors, fields } = validateForm(
        urlEasyPanel,
        contactId,
        locationId,
        emailTester
      );

      if (!isValid) {
        setFieldErrors(fields);
        setMessages((prev) => addChatMessage(prev, "system", `Errores de validación ❌: ${errors.join(" | ")}`));
        return; // No iniciar timer ni testeo
      }
      setFieldErrors({});

      // Limpiar chat para empezar en limpio
      setMessages([]);
      lastRenderedCountRef.current = 0; // reiniciar control de duplicados

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

    // Parar testeo
    if (isBatchRunning) {
      stopBatchTest(); // Detener el testeo masivo en progreso
      reset(); // Resetear el timer a 00:00
    } else {
      reset(); // Resetear el timer si es testeo individual
      resetBatchTest(); // Resetear batch si no está corriendo
    }
  }

  return (
    <main className="min-h-screen w-full px-6 py-8 md:px-10">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        {/* ==================== HEADER ==================== */}
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Testeo Automático Bots
          </h1>
        </header>



        {/* ==================== FORMULARIO ==================== */}

        {/* Campos de configuración del testeo */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo: URL del endpoint del bot */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">URL EasyPanel</label>
            <input
              className={`h-10 rounded-md border bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30 ${fieldErrors.urlEasyPanel ? "border-red-500" : "border-black/10 dark:border-white/15"}`}
              placeholder="https://..."
              value={urlEasyPanel}
              onChange={(e) => setUrlEasyPanel(e.target.value)}
            />
            {fieldErrors.urlEasyPanel && (
              <span className="text-xs text-red-500">{fieldErrors.urlEasyPanel}</span>
            )}
          </div>

          {/* Campo: ID del contacto */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Contact ID (GHL)</label>
            <input
              className={`h-10 rounded-md border bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30 ${fieldErrors.contactId ? "border-red-500" : "border-black/10 dark:border-white/15"}`}
              placeholder="12345"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            />
            {fieldErrors.contactId && (
              <span className="text-xs text-red-500">{fieldErrors.contactId}</span>
            )}
          </div>

          {/* Campo: ID de la ubicación */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Location ID (GHL)</label>
            <input
              className={`h-10 rounded-md border bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30 ${fieldErrors.locationId ? "border-red-500" : "border-black/10 dark:border-white/15"}`}
              placeholder="abc-001"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            />
            {fieldErrors.locationId && (
              <span className="text-xs text-red-500">{fieldErrors.locationId}</span>
            )}
          </div>

          {/* Campo: Email del tester */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email Tester</label>
            <input
              className={`h-10 rounded-md border bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30 ${fieldErrors.emailTester ? "border-red-500" : "border-black/10 dark:border-white/15"}`}
              placeholder="tester@dominio.com"
              type="email"
              value={emailTester}
              onChange={(e) => setEmailTester(e.target.value)}
            />
            {fieldErrors.emailTester && (
              <span className="text-xs text-red-500">{fieldErrors.emailTester}</span>
            )}
          </div>
        </section>

        {/* ==================== CHAT ==================== */}
        <section className="rounded-xl border border-black/10 dark:border-white/15 overflow-hidden">
          {/* Área de mensajes del chat - scrolleable */}
          <div ref={chatRef} className="h-[500px] overflow-y-auto bg-black/[.03] dark:bg-white/[.03] p-4 space-y-2">
            {/* Estado vacío - cuando no hay mensajes */}
            {messages.length === 0 ? (
              <p className="text-sm text-foreground/70 text-center">Aquí aparecerá el progreso del testeo...</p>
            ) : (
              /* Lista de mensajes del chat */
              messages.map((m, i) => (
                /* Burbuja de mensaje individual */
                <div
                  key={i}
                  className={`text-sm leading-6 p-1.5 rounded-lg ${
                    /* Estilos según el rol del mensaje */
                    m.role === "user"
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" // Usuario (preguntas)
                      : m.role === "system"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500" // Sistema (notificaciones)
                        : "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500" // Bot (respuestas)
                    }`}
                >
                  {/* Encabezado del mensaje: remitente + hora (arriba a la derecha) */}
                  <div className="flex items-baseline justify-between">
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
                    {m.timestamp && (
                      <span className="text-[10px] italic opacity-70">{m.timestamp}</span>
                    )}
                  </div>

                  {/* Contenido del mensaje */}
                  <div
                    className={
                      m.role === "user"
                        ? "text-blue-900 dark:text-blue-100"
                        : m.role === "system"
                          ? "text-yellow-900 dark:text-yellow-100"
                          : "text-green-800 dark:text-green-100 "
                    }
                  >
                    {/* Texto principal del mensaje */}
                    <div>{m.content}</div>

                    {/* Sección desplegable de respuesta esperada (solo en testeo masivo) */}
                    {m.expectedResponse && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                          Ver respuesta esperada
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

          {/* ==================== CONTROLES DEL CHAT ==================== */}

          {/* Selector de modo de testeo */}
          <section className="flex items-center justify-between border border-black/10 dark:border-white/15 rounded-lg p-4">
            {/* Opciones de radio para elegir tipo de testeo */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Modo de testeo:</span>

              {/* Opción: Testeo masivo */}
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

              {/* Opción: Testeo individual */}
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
              {/* Tooltip con icono de información */}
              <DynamicToolTip />
            </div>


            {/* Indicador de progreso del testeo masivo */}
            {isBatchMode && progress.total > 0 && (
              <div className="text-sm font-semibold text-gray-600 dark:text-yellow-400 flex items-center gap-2">
                {/* Spinner de carga */}
                {isBatchRunning && (
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" aria-label="cargando"></span>
                )}
                <span>
                  Progreso: {progress.current}/{progress.total}
                </span>
                {progress.current > 0 && (
                  <span className="ml-2">
                    ({Math.round((progress.current / progress.total) * 100)}%)
                  </span>
                )}
              </div>
            )}
          </section>

          {/* Pie del chat: controles principales */}
          <div className="flex items-center justify-center gap-4 border-t border-black/10 dark:border-white/15 px-4 py-3">
            {/* Botón principal: Iniciar/Stop */}
            <button
              type="button"
              onClick={handleStart}
              className={`inline-flex items-center justify-center rounded-md text-white px-4 py-2 text-sm font-bold cursor-pointer w-20 active:scale-95 transition-all duration-100 ${(isRunning || isBatchRunning) ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {(isRunning || isBatchRunning) ? "STOP" : "INICIAR"}
            </button>

            {/* Contador de tiempo */}
            <div className="text-sm font-semibold tabular-nums text-yellow-400 border border-gray-400 p-1.5 rounded-md">
              {formattedTime}
            </div>
          </div>
        </section>

        {/* ==================== ESTADÍSTICAS ==================== */}

        {/* Panel de resumen del testeo masivo */}
        {isBatchMode && summary && (
          <section ref={summaryRef} className="border border-black/10 dark:border-white/15 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">📊 Resumen del Test</h3>


            {/* Métricas principales en tarjetas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Total de preguntas */}
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.completed}/{summary.total}</div>
                <div className="text-sm text-blue-600">Completadas</div>
              </div>

              {/* Respuestas exitosas */}
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summary.successful}</div>
                <div className="text-sm text-green-600">Exitosos</div>
              </div>

              {/* Respuestas fallidas */}
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                <div className="text-sm text-red-600">Fallidos</div>
              </div>

              {/* Porcentaje de éxito */}
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{summary.successRate}%</div>
                <div className="text-sm text-yellow-600">Éxito</div>
              </div>
            </div>

            {/* Distribución por categorías de preguntas */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <h4 className="font-medium">Distribución por categorías:</h4>
                {/* Tooltip con icono de información */}
                <DynamicToolTip />
              </div>
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

            {/* Tiempo total del testeo */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Duración total: {formatDuration(summary.duration)}
            </div>
          </section>
        )}


      </section>
    </main>
  );
}
