import { StatCard } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LeadStatusBadge } from "@/components/ui/Badge";
import type { Lead } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  try {
    await requireAuth();
  } catch {
    redirect("/admin/login");
  }

  const [
    totalLeads,
    newLeads,
    totalBookings,
    totalJobs,
    completedJobs,
    bookedLeads,
    completedLeads,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.booking.count(),
    prisma.job.count(),
    prisma.job.count({ where: { status: "COMPLETED" } }),
    prisma.lead.count({ where: { status: "BOOKED" } }),
    prisma.lead.count({ where: { status: "COMPLETED" } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const conversionRate =
    totalLeads > 0
      ? Math.round(((bookedLeads + completedLeads) / totalLeads) * 100)
      : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Översikt</h1>
        <p className="text-slate-500 text-sm mt-1">Välkommen tillbaka!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Totalt leads"
          value={totalLeads}
          color="blue"
          trend={`${newLeads} nya idag`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
          }
        />
        <StatCard
          label="Bokningar"
          value={totalBookings}
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Aktiva jobb"
          value={totalJobs - completedJobs}
          color="amber"
          trend={`${completedJobs} avslutade`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          }
        />
        <StatCard
          label="Konverteringsgrad"
          value={`${conversionRate}%`}
          color="green"
          trend="Leads som blivit kunder"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Senaste leads</h2>
          <Link href="/admin/leads" className="text-sm text-blue-600 hover:text-blue-700">
            Visa alla →
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="px-6 py-10 text-center text-slate-500 text-sm">
            Inga leads ännu. Leads visas här när kunder fyller i offertformuläret.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-slate-900 text-sm">{lead.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {lead.address} · {lead.houseSize} m²
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LeadStatusBadge status={lead.status as Lead["status"]} />
                  <span className="text-xs text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString("sv-SE")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/leads", label: "Hantera leads", icon: "📋", desc: `${newLeads} nya att följa upp` },
          { href: "/admin/customers", label: "Kundregister", icon: "👥", desc: "Se alla kunder" },
          { href: "/admin/jobs", label: "Jobböversikt", icon: "🔧", desc: "Planera och följ jobb" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <span className="text-2xl">{a.icon}</span>
            <div>
              <div className="font-medium text-slate-900 text-sm">{a.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
