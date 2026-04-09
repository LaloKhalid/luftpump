import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LeadStatusBadge } from "@/components/ui/Badge";
import type { Lead, LeadStatus } from "@/types";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Alla status" },
  { value: "NEW", label: "Ny" },
  { value: "CONTACTED", label: "Kontaktad" },
  { value: "BOOKED", label: "Bokad" },
  { value: "COMPLETED", label: "Klar" },
  { value: "LOST", label: "Förlorad" },
];

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  try {
    await requireAuth();
  } catch {
    redirect("/admin/login");
  }

  const { status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam || "1"));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = status ? { status: status as LeadStatus } : {};

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} totalt</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 p-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={`/admin/leads${opt.value ? `?status=${opt.value}` : ""}`}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              (status || "") === opt.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {leads.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-500">
            <div className="text-4xl mb-4">📋</div>
            <p className="font-medium">Inga leads hittades</p>
            <p className="text-sm mt-1">Leads visas här när kunder skickar offertförfrågningar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Namn</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kontakt</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Detaljer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{lead.phone}</div>
                      <div className="text-xs text-slate-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{lead.houseSize} m² · {lead.floors} vån</div>
                      <div className="text-xs text-slate-500 truncate max-w-[160px]">{lead.heatingSystem}</div>
                    </td>
                    <td className="px-6 py-4">
                      <LeadStatusBadge status={lead.status as Lead["status"]} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString("sv-SE")}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Visa →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-slate-500">
            Visar {skip + 1}–{Math.min(skip + limit, total)} av {total}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/leads?page=${page - 1}${status ? `&status=${status}` : ""}`}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                ← Föregående
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/leads?page=${page + 1}${status ? `&status=${status}` : ""}`}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Nästa →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
