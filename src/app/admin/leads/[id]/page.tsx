"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LeadStatusBadge } from "@/components/ui/Badge";
import type { Lead, LeadStatus } from "@/types";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "Ny" },
  { value: "CONTACTED", label: "Kontaktad" },
  { value: "BOOKED", label: "Bokad" },
  { value: "COMPLETED", label: "Klar" },
  { value: "LOST", label: "Förlorad" },
];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setLead(data.data);
        else setError("Lead hittades inte");
      })
      .catch(() => setError("Kunde inte hämta lead"))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: LeadStatus) {
    if (!lead) return;
    setUpdating(true);
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) setLead({ ...lead, status });
    setUpdating(false);
  }

  async function deleteLead() {
    if (!confirm("Är du säker på att du vill ta bort detta lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    router.push("/admin/leads");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error || "Lead hittades inte"}</p>
        <Link href="/admin/leads" className="text-blue-600 text-sm mt-4 inline-block">
          ← Tillbaka
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/leads" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-2">
            ← Alla leads
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <LeadStatusBadge status={lead.status} />
            <span className="text-sm text-slate-500">
              Inkommen {new Date(lead.createdAt).toLocaleDateString("sv-SE")}
            </span>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={deleteLead}>
          Ta bort lead
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Kontaktuppgifter</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Namn", value: lead.name },
                { label: "Telefon", value: lead.phone },
                { label: "E-post", value: lead.email },
                { label: "Adress", value: lead.address },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Fastighetsdetaljer</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Bostadsyta", value: `${lead.houseSize} m²` },
                { label: "Antal våningar", value: String(lead.floors) },
                { label: "Nuvarande system", value: lead.heatingSystem },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
            {lead.message && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Meddelande</dt>
                <dd className="text-sm text-slate-700 leading-relaxed">{lead.message}</dd>
              </div>
            )}
            {lead.imageUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Bifogad bild</dt>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lead.imageUrl} alt="Lead bild" className="max-w-xs rounded-xl border border-slate-200" />
              </div>
            )}
          </div>

          {/* Bookings */}
          {lead.bookings && lead.bookings.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Bokningar</h2>
              <div className="space-y-3">
                {lead.bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {b.type === "CONSULTATION" ? "Konsultation" : "Installation"}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {new Date(b.date).toLocaleDateString("sv-SE")} kl {b.time}
                      </div>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Bokad</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status management */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Uppdatera status</h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateStatus(opt.value)}
                  disabled={updating || lead.status === opt.value}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    lead.status === opt.value
                      ? "bg-blue-600 text-white cursor-default"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {opt.label}
                  {lead.status === opt.value && " ✓"}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Snabbåtgärder</h2>
            <div className="space-y-2">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
              >
                📞 Ring kund
              </a>
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                ✉️ Skicka e-post
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
