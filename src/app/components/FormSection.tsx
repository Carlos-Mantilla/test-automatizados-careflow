"use client";

import React from "react";

type FieldName = "urlEasyPanel" | "contactId" | "locationId";

export interface FormSectionProps {
  urlEasyPanel: string;
  contactId: string;
  locationId: string;
  fieldErrors: Partial<Record<FieldName, string>>;
  onChange: (field: FieldName, value: string) => void;
}

export default function FormSection(props: FormSectionProps) {
  const { urlEasyPanel, contactId, locationId, fieldErrors, onChange } = props;

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      {/* Campo: URL EasyPanel */}
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className=" font-semibold">🔗 URL EasyPanel</label>
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

      {/* Campo: Location ID */}
      <div className="flex flex-col gap-1 md:col-span-1">
        <label className=" font-semibold">📍 Location ID (GHL)</label>
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

      {/* Campo: Contact ID */}
      <div className="flex flex-col gap-1 md:col-span-1">
        <label className=" font-semibold">👤 Contact ID (GHL)</label>
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


    </section>
  );
}


