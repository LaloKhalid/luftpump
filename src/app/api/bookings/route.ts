import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { validateBooking } from "@/lib/validations";
import { sendNewBookingEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { date: "asc" },
      skip,
      take: limit,
      include: {
        lead: { select: { id: true, name: true, phone: true, email: true } },
      },
    }),
    prisma.booking.count(),
  ]);

  return NextResponse.json({
    success: true,
    data: bookings,
    meta: { total, page, limit },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors = validateBooking(body);

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const date = new Date(body.date);

    // Prevent double booking - check same date/time slot
    const existing = await prisma.booking.findFirst({
      where: {
        date: { gte: new Date(date.setHours(0, 0, 0, 0)), lt: new Date(date.setHours(23, 59, 59, 999)) },
        time: String(body.time),
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Det valda tidslutet är redan bokat. Välj ett annat." },
        { status: 409 }
      );
    }

    const lead = await prisma.lead.findUnique({ where: { id: Number(body.leadId) } });
    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead hittades inte" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        leadId: Number(body.leadId),
        date: new Date(body.date),
        time: String(body.time),
        type: body.type,
        notes: body.notes ?? null,
      },
      include: { lead: true },
    });

    // Update lead status to BOOKED
    await prisma.lead.update({
      where: { id: Number(body.leadId) },
      data: { status: "BOOKED" },
    });

    // Send emails in background
    sendNewBookingEmail({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      date: new Date(body.date).toLocaleDateString("sv-SE"),
      time: String(body.time),
      type: body.type,
    }).catch(() => {});

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Serverfel" }, { status: 500 });
  }
}
