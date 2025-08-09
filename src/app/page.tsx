"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatTime, startTimer, stopTimer, resetTimer } from "@/helpers/timer";
import { scrollToBottom } from "@/helpers/chat";
import { addChatMessage } from "@/helpers/openaiClient";
import { sendToModel } from "@/helpers/sendToModel";
import type { ChatMessage } from "@/lib/openai";

type BotResponse = {
  ok: boolean;
  status: number;
  data: {
    respuesta?: string;
    agente?: string;
    entregado_a?: string;
    origin?: string;
  };
};

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


  // Procesa el inicio del testeo - lógica de UI únicamente
  async function handleSendToModel() {
    // 1) Mensaje de inicio en el chat
    const systemMessage = `Iniciando testeo...`;
    setMessages((prev) => addChatMessage(prev, "system", systemMessage));

    // 2) Ejecutar testeo usando el helper
    const result = await sendToModel({
      urlEasyPanel,
      contactId,
      locationId,
      emailTester,
    });

    // 3) Mostrar resultado en el chat
    setMessages((prev) => addChatMessage(prev, "system", result.message));

    // 4) Mostrar el mensaje enviado al bot
    if (result.messageBody) {
      setMessages((prev) => addChatMessage(prev, "user", `${result.messageBody}`));
    }

    // 5) Mostrar la respuesta del bot
    // Extraer la respuesta específica del bot
    const botData = result.botResponse as BotResponse;
    const botMessage = botData?.data?.respuesta || "Sin respuesta del bot";

    console.log("Respuesta del bot (completa):", result.botResponse);

    setMessages((prev) => addChatMessage(prev, "assistant", `${botMessage}`));
  }



  // Controla el botón: inicia el temporizador y lanza la llamada; o bien detiene y resetea
  function handleStart(): void {
    if (!isRunning) {
      resetTimer(setElapsedSeconds);
      setIsRunning(true);
      void handleSendToModel();
      return;
    }
    stopTimer(intervalRef);
    resetTimer(setElapsedSeconds);
    setIsRunning(false);
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
              className={`inline-flex items-center justify-center rounded-md text-white px-4 py-2 text-sm font-bold cursor-pointer w-20 active:scale-95 transition-all duration-100 ${isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {isRunning ? "Stop" : "Iniciar"}
            </button>
            {/* Contador de tiempo */}
            <div className="text-sm font-semibold tabular-nums text-yellow-400 border border-gray-400 p-1.5 rounded-md">
              {formattedTime}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
