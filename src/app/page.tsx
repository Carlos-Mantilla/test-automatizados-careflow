"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatTime, startTimer, stopTimer, resetTimer } from "@/helpers/timer";
import { scrollToBottom } from "@/helpers/chat";
import { /* sendToOpenAI, */ addChatMessage, type TestFormData } from "@/helpers/openaiClient";
// import { validateForm } from "@/helpers/validation";
import type { ChatMessage } from "@/lib/openai";

export default function Home() {
  // Estado de los inputs del formulario superior
  const [urlEasyPanel, setUrlEasyPanel] = useState("");
  const [contactId, setContactId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [emailTester, setEmailTester] = useState("");

  // Historial del chat y control del temporizador
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Referencias para manejar el intervalo y el contenedor del chat
  const intervalRef = useRef<number | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  // Efecto: inicia/limpia el intervalo del temporizador según isRunning
  useEffect(() => {
    if (!isRunning) return;
    startTimer(setElapsedSeconds, intervalRef);
    return () => stopTimer(intervalRef);
  }, [isRunning]);

  // Efecto: hace scroll al final cada vez que llegan nuevos mensajes
  useEffect(() => {
    scrollToBottom(chatRef);
  }, [messages]);

  // Memo: convierte los segundos transcurridos a formato mm:ss
  const formattedTime = useMemo(() => formatTime(elapsedSeconds), [elapsedSeconds]);

  // Procesa el inicio del testeo (por ahora solo un mensaje de confirmación)
  async function sendToModel() {
    // 1) Validación básica de campos (comentada temporalmente para desarrollo)
    // const { isValid, errors } = validateForm(urlEasyPanel, contactId, locationId, emailTester);
    // if (!isValid) {
    //   setMessages((prev) => [
    //     ...prev,
    //     { role: "assistant", content: `Errores: ${errors.join(" | ")}` },
    //   ]);
    //   return;
    // }

    // 2) Preparar datos del formulario (para futura API de testeo)
    const formData: TestFormData = {
      urlEasyPanel,
      contactId,
      locationId,
      emailTester,
    };
    console.log("Datos del formulario preparados:", formData); // TODO: enviar a API de testeo

    // 3) Por ahora, solo agregar mensaje de inicio al chat
    const userMessage = `Iniciando testeo automático con los datos configurados...`;
    setMessages((prev) => addChatMessage(prev, "user", userMessage));

    // 4) TODO: Aquí irá la lógica para enviar formData a la API de testeo
    // 5) TODO: Aquí usaremos sendToOpenAI() con datos específicos para el modelo

    // Mensaje temporal de confirmación
    const confirmationMessage = "Testeo iniciado. Próximamente se integrará con la API real.";
    setMessages((prev) => addChatMessage(prev, "assistant", confirmationMessage));
  }

  // Envía el POST mínimo al bot (endpoint interno)
  async function sendMinimalBot() {
    setMessages((prev) => addChatMessage(prev, "user", "Enviando POST mínimo al bot..."));
    try {
      const res = await fetch("/api/bot/send", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) // Body vacío para usar defaults
      });
      const data = await res.json();
      const status = data.ok ? "✅ POST enviado correctamente" : `❌ Error (${data.status ?? "desconocido"})`;
      setMessages((prev) => addChatMessage(prev, "assistant", status));
      console.log("Resultado bot:", data);
    } catch (error) {
      setMessages((prev) => addChatMessage(prev, "assistant", "❌ Error de conexión"));
      console.error(error);
    }
  }

  // Controla el botón: inicia el temporizador y lanza la llamada; o bien detiene y resetea
  function handleStart(): void {
    if (!isRunning) {
      resetTimer(setElapsedSeconds);
      setIsRunning(true);
      void sendToModel();
      return;
    }
    stopTimer(intervalRef);
    resetTimer(setElapsedSeconds);
    setIsRunning(false);
  }

  return (
    <div className="min-h-screen w-full px-6 py-8 md:px-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Testeo Automático Bots
          </h1>
        </div>

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
                <div key={i} className="text-sm leading-6">
                  <span className="font-semibold">{m.role === "user" ? "Tú: " : "Bot: "}</span>
                  {m.content}
                </div>
              ))
            )}
          </div>

          {/* Pie del chat: botón de control y temporizador */}
          <div className="flex items-center justify-center gap-4 border-t border-black/10 dark:border-white/15 px-4 py-3">
            <button
              type="button"
              onClick={handleStart}
              className={`inline-flex items-center justify-center rounded-md text-white px-4 py-2 text-sm font-bold cursor-pointer ${isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {isRunning ? "Stop" : "Iniciar"}
            </button>

            {/* Botón para enviar POST mínimo */}
            <button
              type="button"
              onClick={sendMinimalBot}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-bold cursor-pointer"
            >
              Enviar POST
            </button>

            <div className="text-sm font-semibold tabular-nums text-yellow-400 border border-gray-400 p-1.5 rounded-md">
              {formattedTime}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
