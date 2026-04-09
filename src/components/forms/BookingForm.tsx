"use client";

import React, { useState, useEffect } from "react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FormState {
  name: string;
  phone: string;
  email: string;
  type: string;
  date: string;
  time: string;
  leadId: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  email: "",
  type: "CONSULTATION",
  date: "",
  time: "",
  leadId: "",
};

export function BookingForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  useEffect(() => {
    if (!form.date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    fetch(`/api/bookings/available?date=${form.date}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAvailableSlots(data.data);
      })
      .finally(() => setLoadingSlots(false));
  }, [form.date]);

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "date") setForm((prev) => ({ ...prev, [field]: value, time: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    // For booking without existing lead, create a lead first
    try {
      let leadId = form.leadId ? Number(form.leadId) : null;

      if (!leadId) {
        // Create anonymous lead for the booking
        const leadRes = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: "Okänd (via bokningssida)",
            houseSize: 100,
            floors: 1,
            heatingSystem: "Okänt",
            message: `Bokning via webbsida: ${form.type === "CONSULTATION" ? "Konsultation" : "Installation"}`,
          }),
        });
        const leadData = await leadRes.json();
        if (!leadRes.ok) {
          if (leadData.errors) {
            const fieldErrors: Record<string, string> = {};
            leadData.errors.forEach((e: { field: string; message: string }) => {
              fieldErrors[e.field] = e.message;
            });
            setErrors(fieldErrors);
            return;
          }
        }
        leadId = leadData.data.id;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          date: form.date,
          time: form.time,
          type: form.type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Bokning misslyckades. Försök igen.");
        return;
      }

      setSuccess(true);
    } catch {
      setServerError("Nätverksfel. Kontrollera din anslutning.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Bokning bekräftad!
        </h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Din bokning är registrerad. Du får en bekräftelse via e-post med alla detaljer. Vi ses snart!
        </p>
        <Button className="mt-8" onClick={() => { setSuccess(false); setForm(INITIAL_STATE); }} variant="outline">
          Gör en ny bokning
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

      <Select
        label="Typ av besök"
        required
        value={form.type}
        onChange={(e) => updateField("type", e.target.value)}
        options={[
          { value: "CONSULTATION", label: "Konsultation (gratis rådgivning)" },
          { value: "INSTALLATION", label: "Installation" },
        ]}
      />

      <Input
        label="Välj datum"
        required
        type="date"
        min={minDate}
        max={maxDateStr}
        value={form.date}
        onChange={(e) => updateField("date", e.target.value)}
        error={errors.date}
      />

      {/* Time slots */}
      {form.date && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Välj tid <span className="text-red-500">*</span>
          </label>
          {loadingSlots ? (
            <p className="text-sm text-slate-500">Laddar lediga tider...</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-red-600">Inga lediga tider detta datum. Välj ett annat datum.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => updateField("time", slot)}
                  className={`py-2.5 text-sm font-medium rounded-xl border transition-all ${
                    form.time === slot
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
          {errors.time && <p className="text-xs text-red-600">{errors.time}</p>}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        loading={loading}
        disabled={!form.time}
        className="w-full sm:w-auto"
      >
        Bekräfta bokning
      </Button>
    </form>
  );
}
