import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const [
    totalLeads,
    newLeads,
    totalBookings,
    totalJobs,
    completedJobs,
    bookedLeads,
    completedLeads,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.booking.count(),
    prisma.job.count(),
    prisma.job.count({ where: { status: "COMPLETED" } }),
    prisma.lead.count({ where: { status: "BOOKED" } }),
    prisma.lead.count({ where: { status: "COMPLETED" } }),
  ]);

  const conversionRate =
    totalLeads > 0
      ? Math.round(((bookedLeads + completedLeads) / totalLeads) * 100)
      : 0;

  return NextResponse.json({
    success: true,
    data: {
      totalLeads,
      newLeads,
      totalBookings,
      totalJobs,
      completedJobs,
      conversionRate,
    },
  });
}
