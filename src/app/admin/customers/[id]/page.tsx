"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { JobStatusBadge } from "@/components/ui/Badge";
import { Input, Textarea } from "@/components/ui/Input";
import type { Customer, Job } from "@/types";

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCustomer(data.data);
          setNotes(data.data.notes || "");
        } else {
          setError("Kund hittades inte");
        }
      })
      .catch(() => setError("Kunde inte hämta kund"))
      .finally(() => setLoading(false));
  }, [id]);

  async function saveNotes() {
    if (!customer) return;
    setSaving(true);
    const res = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    const data = await res.json();
    if (data.success) {
      setCustomer({ ...customer, notes });
      setEditing(false);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error || "Kund hittades inte"}</p>
        <Link href="/admin/customers" className="text-blue-600 text-sm mt-4 inline-block">← Tillbaka</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/customers" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-2">
          ← Alla kunder
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Kund sedan {new Date(customer.createdAt).toLocaleDateString("sv-SE")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Kontaktuppgifter</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Telefon", value: customer.phone },
                { label: "E-post", value: customer.email },
                { label: "Adress", value: customer.address },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Anteckningar</h2>
              {!editing ? (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Redigera</Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setNotes(customer.notes || ""); }}>
                    Avbryt
                  </Button>
                  <Button size="sm" loading={saving} onClick={saveNotes}>Spara</Button>
                </div>
              )}
            </div>
            {editing ? (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Lägg till anteckningar om kunden..."
                rows={5}
              />
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed">
                {customer.notes || <span className="text-slate-400 italic">Inga anteckningar</span>}
              </p>
            )}
          </div>

          {/* Job history */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Jobbhistorik</h2>
              <Link href="/admin/jobs" className="text-sm text-blue-600 hover:text-blue-700">Skapa nytt jobb →</Link>
            </div>
            {!customer.jobs || customer.jobs.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Inga jobb registrerade</p>
            ) : (
              <div className="space-y-3">
                {customer.jobs.map((job: Job) => (
                  <div key={job.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                    <div>
                      <div className="font-medium text-sm text-slate-900">Jobb #{job.id}</div>
                      {job.scheduledDate && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {new Date(job.scheduledDate).toLocaleDateString("sv-SE")}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {job.technician && <span className="text-xs text-slate-500">{job.technician}</span>}
                      <JobStatusBadge status={job.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Snabbåtgärder</h2>
            <div className="space-y-2">
              <a
                href={`tel:${customer.phone}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
              >
                📞 Ring kund
              </a>
              <a
                href={`mailto:${customer.email}`}
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
