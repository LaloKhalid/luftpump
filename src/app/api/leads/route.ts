import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { validateLead } from "@/lib/validations";
import { sendNewLeadEmail } from "@/lib/email";
import { LeadStatus } from "@/types";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as LeadStatus | null;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { bookings: { select: { id: true, date: true, time: true, type: true } } },
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: leads,
    meta: { total, page, limit },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors = validateLead(body);

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: String(body.email).trim().toLowerCase(),
        address: String(body.address).trim(),
        houseSize: Number(body.houseSize),
        floors: Number(body.floors),
        heatingSystem: String(body.heatingSystem).trim(),
        message: body.message ? String(body.message).trim() : null,
        imageUrl: body.imageUrl ?? null,
        status: "NEW",
      },
    });

    // Fire email in background - don't block the response
    sendNewLeadEmail({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      houseSize: lead.houseSize,
      floors: lead.floors,
      heatingSystem: lead.heatingSystem,
      message: lead.message ?? undefined,
    }).catch(() => {
      // Email failure should not fail the request
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Serverfel" }, { status: 500 });
  }
}
