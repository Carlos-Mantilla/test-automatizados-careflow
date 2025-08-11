"use client";

import React from "react";

type FieldName = "urlEasyPanel" | "contactId" | "locationId" | "emailTester";

export interface FormSectionProps {
  urlEasyPanel: string;
  contactId: string;
  locationId: string;
  emailTester: string;
  fieldErrors: Partial<Record<FieldName, string>>;
  onChange: (field: FieldName, value: string) => void;
}

export default function FormSection(props: FormSectionProps) {
  const { urlEasyPanel, contactId, locationId, emailTester, fieldErrors, onChange } = props;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Campo: URL del endpoint del bot */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">🔗 URL EasyPanel</label>
        <input
          className={`h-10 rounded-md border bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30 text-gray-400 ${fieldErrors.urlEasyPanel ? "border-red-700" : "border-black/10 dark:border-white/15"}`}
          placeholder="https://n8n-gotiger-bot-esdras..."
          value={urlEasyPanel}
          onChange={(e) => onChange("urlEasyPanel", e.target.value)}
        />
        {fieldErrors.urlEasyPanel && (
          <span className="text-xs text-red-700">{fieldErrors.urlEasyPanel}</span>
        )}
      </div>

      {/* Campo: ID del contacto */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">👤 Contact ID (GHL)</label>
        <input
          className={`h-10 rounded-md border bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30 text-gray-400 ${fieldErrors.contactId ? "border-red-700" : "border-black/10 dark:border-white/15"}`}
          placeholder="3oLF4VLMplbFH0fQmgKF"
          value={contactId}
          onChange={(e) => onChange("contactId", e.target.value)}
        />
        {fieldErrors.contactId && (
          <span className="text-xs text-red-700">{fieldErrors.contactId}</span>
        )}
      </div>

      {/* Campo: ID de la ubicación */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">📍 Location ID (GHL)</label>
        <input
          className={`h-10 rounded-md border bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30 text-gray-400 ${fieldErrors.locationId ? "border-red-700" : "border-black/10 dark:border-white/15"}`}
          placeholder="odQon2KjVfTD1ubFdwBK"
          value={locationId}
          onChange={(e) => onChange("locationId", e.target.value)}
        />
        {fieldErrors.locationId && (
          <span className="text-xs text-red-700">{fieldErrors.locationId}</span>
        )}
      </div>

      {/* Campo: Email del tester */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">✉️ Email Tester</label>
        <input
          className={`h-10 rounded-md border bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/30 text-gray-400 ${fieldErrors.emailTester ? "border-red-700" : "border-black/10 dark:border-white/15"}`}
          placeholder="sergiog@starassistants.com"
          type="email"
          value={emailTester}
          onChange={(e) => onChange("emailTester", e.target.value)}
        />
        {fieldErrors.emailTester && (
          <span className="text-xs text-red-700">{fieldErrors.emailTester}</span>
        )}
      </div>
    </section>
  );
}


