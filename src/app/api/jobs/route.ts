import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  const where = status ? { status: status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" } : {};

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { scheduledDate: "asc" },
      skip,
      take: limit,
      include: {
        customer: { select: { id: true, name: true, phone: true, email: true } },
        booking: { select: { id: true, date: true, time: true, type: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: jobs,
    meta: { total, page, limit },
  });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.customerId) {
      return NextResponse.json({ success: false, error: "customerId krävs" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        customerId: Number(body.customerId),
        bookingId: body.bookingId ? Number(body.bookingId) : null,
        technician: body.technician ?? null,
        status: "PENDING",
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        notes: body.notes ?? null,
      },
      include: {
        customer: true,
        booking: true,
      },
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Serverfel" }, { status: 500 });
  }
}
