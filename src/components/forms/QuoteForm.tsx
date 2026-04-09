"use client";

import React, { useState } from "react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HEATING_SYSTEMS } from "@/types";

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  houseSize: string;
  floors: string;
  heatingSystem: string;
  message: string;
  imageFile: File | null;
}

interface FieldErrors {
  [key: string]: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  houseSize: "",
  floors: "",
  heatingSystem: "",
  message: "",
  imageFile: null,
};

export function QuoteForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    try {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (form.imageFile) {
        const fd = new FormData();
        fd.append("file", form.imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imageUrl = uploadData.data.url;
        }
      }

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          houseSize: Number(form.houseSize),
          floors: Number(form.floors),
          heatingSystem: form.heatingSystem,
          message: form.message || undefined,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const fieldErrors: FieldErrors = {};
          data.errors.forEach((e: { field: string; message: string }) => {
            fieldErrors[e.field] = e.message;
          });
          setErrors(fieldErrors);
        } else {
          setServerError(data.error || "Något gick fel. Försök igen.");
        }
        return;
      }

      setSuccess(true);
      setForm(INITIAL_STATE);
    } catch {
      setServerError("Nätverksfel. Kontrollera din anslutning och försök igen.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Tack för din förfrågan!
        </h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Vi har mottagit din offertförfrågan och återkommer till dig inom 24 timmar. Kolla din e-post för bekräftelse.
        </p>
        <Button
          className="mt-8"
          onClick={() => setSuccess(false)}
          variant="outline"
        >
          Skicka ny förfrågan
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Fullständigt namn"
          required
          placeholder="Anna Svensson"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          error={errors.name}
        />
        <Input
          label="Telefonnummer"
          required
          type="tel"
          placeholder="+46 70 123 45 67"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          error={errors.phone}
        />
      </div>

      <Input
        label="E-postadress"
        required
        type="email"
        placeholder="anna@exempel.se"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        error={errors.email}
      />

      <Input
        label="Adress (gatuadress, postnummer, ort)"
        required
        placeholder="Storgatan 12, 111 51 Stockholm"
        value={form.address}
        onChange={(e) => updateField("address", e.target.value)}
        error={errors.address}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bostadsyta (m²)"
          required
          type="number"
          min="10"
          max="5000"
          placeholder="120"
          value={form.houseSize}
          onChange={(e) => updateField("houseSize", e.target.value)}
          error={errors.houseSize}
          hint="Total uppvärmd yta"
        />
        <Select
          label="Antal våningar"
          required
          value={form.floors}
          onChange={(e) => updateField("floors", e.target.value)}
          error={errors.floors}
          placeholder="Välj antal"
          options={[
            { value: "1", label: "1 våning" },
            { value: "2", label: "2 våningar" },
            { value: "3", label: "3 våningar" },
            { value: "4", label: "4 våningar eller fler" },
          ]}
        />
      </div>

      <Select
        label="Nuvarande värmesystem"
        required
        value={form.heatingSystem}
        onChange={(e) => updateField("heatingSystem", e.target.value)}
        error={errors.heatingSystem}
        placeholder="Välj ditt nuvarande system"
        options={HEATING_SYSTEMS.map((h) => ({ value: h, label: h }))}
      />

      <Textarea
        label="Meddelande (valfritt)"
        placeholder="Berätta mer om dina behov, specifika önskemål eller frågor..."
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
        rows={4}
      />

      {/* Image upload */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Bifoga bild (valfritt)
        </label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Välj bild
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, imageFile: e.target.files?.[0] ?? null }))
              }
            />
          </label>
          {form.imageFile && (
            <span className="text-sm text-slate-600">{form.imageFile.name}</span>
          )}
        </div>
        <p className="text-xs text-slate-500">Max 5 MB. JPG, PNG, WebP.</p>
      </div>

      <div className="pt-2">
        <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
          Skicka offertförfrågan
        </Button>
        <p className="text-xs text-slate-500 mt-3">
          Inga bindningar. Vi kontaktar dig inom 24 timmar.
        </p>
      </div>
    </form>
  );
}
