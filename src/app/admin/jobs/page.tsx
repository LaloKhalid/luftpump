"use client";

import React, { useState, useEffect } from "react";
import { JobStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Job, JobStatus } from "@/types";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Alla" },
  { value: "PENDING", label: "Väntar" },
  { value: "IN_PROGRESS", label: "Pågår" },
  { value: "COMPLETED", label: "Klar" },
  { value: "CANCELLED", label: "Avbruten" },
];

const STATUS_UPDATE_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "PENDING", label: "Väntar" },
  { value: "IN_PROGRESS", label: "Pågår" },
  { value: "COMPLETED", label: "Klar" },
  { value: "CANCELLED", label: "Avbruten" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingJob, setEditingJob] = useState<number | null>(null);
  const [technicianInput, setTechnicianInput] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/jobs${statusFilter ? `?status=${statusFilter}` : ""}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.data);
          setTotal(data.meta?.total ?? 0);
        }
      })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  async function updateJob(id: number, update: Partial<{ status: JobStatus; technician: string }>) {
    setUpdating(true);
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    const data = await res.json();
    if (data.success) {
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...update } : j)));
    }
    setEditingJob(null);
    setUpdating(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobb</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} totalt</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 p-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              statusFilter === opt.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-500">
            <div className="text-4xl mb-4">🔧</div>
            <p className="font-medium">Inga jobb hittades</p>
            <p className="text-sm mt-1">Jobb skapas från kundprofiler.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Jobb #</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kund</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tekniker</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{job.id}</td>
                    <td className="px-6 py-4">
                      {job.customer ? (
                        <div>
                          <div className="font-medium text-slate-900">{job.customer.name}</div>
                          <div className="text-xs text-slate-500">{job.customer.phone}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">–</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingJob === job.id ? (
                        <div className="flex gap-2">
                          <input
                            value={technicianInput}
                            onChange={(e) => setTechnicianInput(e.target.value)}
                            placeholder="Teknikerns namn"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-40"
                          />
                          <button
                            onClick={() => updateJob(job.id, { technician: technicianInput })}
                            disabled={updating}
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg"
                          >
                            Spara
                          </button>
                          <button onClick={() => setEditingJob(null)} className="text-xs px-3 py-1.5 bg-slate-100 rounded-lg">
                            Avbryt
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingJob(job.id); setTechnicianInput(job.technician || ""); }}
                          className="text-slate-700 hover:text-blue-600 transition-colors"
                        >
                          {job.technician || <span className="text-slate-400 italic">Ej tilldelad</span>}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-xs">
                      {job.scheduledDate
                        ? new Date(job.scheduledDate).toLocaleDateString("sv-SE")
                        : <span className="text-slate-400">–</span>}
                    </td>
                    <td className="px-6 py-4">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={job.status}
                        onChange={(e) => updateJob(job.id, { status: e.target.value as JobStatus })}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        {STATUS_UPDATE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
