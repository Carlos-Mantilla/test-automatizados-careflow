"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useBatchFlow } from "@/hooks/useBatchFlow";
import { useBatchTesting } from "@/hooks/useBatchTesting";
import { addChatMessage } from "@/helpers/chatUtils";
import { testQuestionsData } from "@/testQuestionsData";
import type { ChatMessage } from "@/types/types";
import { useFormValidation } from "@/hooks/useFormValidation";
// UI components:
import ChatSection from "@/app/components/ChatSection";
import FormSection from "@/app/components/FormSection";
import SummarySection from "@/app/components/SummarySection";


export default function Home() {
  // Estado de los inputs del formulario superior
  const [urlEasyPanel, setUrlEasyPanel] = useState("");
  const [contactId, setContactId] = useState("");
  const [locationId, setLocationId] = useState("");
  // Validación (errores por campo)
  const { fieldErrors, validate, clearErrors } = useFormValidation();

  // Historial del chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Custom hooks
  const { isRunning, formattedTime, start, reset, cleanup } = useTimer();
  const { progress, summary, executeBatchTest, resetBatchTest, stopBatchTest, isRunning: isBatchRunning } = useBatchTesting();
  
  // Lógica independiente para duración total del summary
  const [summaryDuration, setSummaryDuration] = useState<string>("00:00");
  const [summaryStartTime, setSummaryStartTime] = useState<number | null>(null);
  const summaryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Referencias para scroll automático
  const chatRef = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  // Evitar duplicar mensajes cuando llega el mismo progreso
  const lastRenderedCountRef = useRef<number>(0);

  // Cleanup del timer al desmontar el componente
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Cleanup del timer del summary al desmontar el componente
  useEffect(() => {
    return () => {
      if (summaryIntervalRef.current) {
        clearInterval(summaryIntervalRef.current);
      }
    };
  }, []);

  // Funciones para manejar la duración del summary
  const startSummaryTimer = useCallback(() => {
    const startTime = Date.now();
    setSummaryStartTime(startTime);
    setSummaryDuration("00:00");
    
    summaryIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setSummaryDuration(formatted);
    }, 1000);
  }, []);

  const stopSummaryTimer = useCallback(() => {
    if (summaryIntervalRef.current) {
      clearInterval(summaryIntervalRef.current);
      summaryIntervalRef.current = null;
    }
  }, []);

  const resetSummaryTimer = useCallback(() => {
    stopSummaryTimer();
    setSummaryDuration("00:00");
    setSummaryStartTime(null);
  }, [stopSummaryTimer]);

  // Hook de flujo de Testeo automático
  const { startBatch } = useBatchFlow({
    executeBatchTest,
    setMessages,
    summaryRef,
    resetTimer: reset,
    stopSummaryTimer,
    testQuestions: testQuestionsData,
  });

  // Efecto para mostrar preguntas y respuestas en tiempo real durante Testeo automático
  useEffect(() => {
    const count = progress.completed.length;
    if (count === 0) return;
    // Evitar duplicados: solo procesar cuando aumenta el número de completadas
    if (count <= lastRenderedCountRef.current) return;

    const lastResult = progress.completed[count - 1];
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `[${lastResult.questionId}] ${lastResult.question}`, timestamp: now },
      { role: "assistant", content: lastResult.actualResponse, expectedResponse: lastResult.expectedResponse, timestamp: now, arbiterVerdict: lastResult.arbiterVerdict }
    ]);

    lastRenderedCountRef.current = count;
  }, [progress.completed, progress.total]);

  // Controla el botón: inicia el temporizador y lanza la llamada; o bien detiene y resetea
  function handleStart(): void {
    const currentlyRunning = isRunning || isBatchRunning;

    if (!currentlyRunning) {
      // Validación previa del formulario
      const { isValid, errors } = validate({ urlEasyPanel, contactId, locationId });
      if (!isValid) {
        setMessages((prev) => addChatMessage(prev, "system", `Errores de validación ❌: ${errors.join(" | ")}`));
        return; // No iniciar timer ni testeo
      }
      clearErrors();

      // Limpiar chat para empezar en limpio
      setMessages([]);
      lastRenderedCountRef.current = 0; // reiniciar control de duplicados

      reset(); // resetear antes de empezar
      resetBatchTest(); // resetear Testeo automático
      resetSummaryTimer(); // resetear timer del summary
      start(); // iniciar timer
      startSummaryTimer(); // iniciar timer del summary

      // Ejecutar Testeo automático
      void startBatch({ urlEasyPanel, contactId, locationId });
      return;
    }

    // Parar testeo
    if (isBatchRunning) {
      stopSummaryTimer(); // Detener timer del summary (preserva el tiempo)
      stopBatchTest(); // Detener el Testeo automático en progreso
      reset(); // Resetear el timer del chat a 00:00
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
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight mx-auto">
            Testeo Automático Bots
          </h1>
        </header>

        {/* ==================== FORMULARIO ==================== */}
        <FormSection
          urlEasyPanel={urlEasyPanel}
          contactId={contactId}
          locationId={locationId}
          fieldErrors={fieldErrors}
          onChange={(field, value) => {
            if (field === "urlEasyPanel") setUrlEasyPanel(value);
            if (field === "contactId") setContactId(value);
            if (field === "locationId") setLocationId(value);
          }}
        />

        {/* ==================== CHAT ==================== */}
        <ChatSection
          messages={messages}
          chatRef={chatRef}
          progressCurrent={progress.current}
          progressTotal={testQuestionsData.length}
          isBatchRunning={isRunning || isBatchRunning}
          onStartClick={handleStart}
          formattedTime={formattedTime}
        />

        {/* ==================== ESTADÍSTICAS ==================== */}
        <SummarySection 
        summary={summary} 
        summaryRef={summaryRef} 
        results={progress.completed} 
        testFormData={{urlEasyPanel, contactId, locationId}}
        formattedTime={summaryDuration}
        />
      </section>
    </main>
  );
}
