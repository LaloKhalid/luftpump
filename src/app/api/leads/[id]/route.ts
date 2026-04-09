import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { LeadStatus } from "@/types";

const VALID_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "BOOKED", "COMPLETED", "LOST"];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id: Number(id) },
    include: {
      bookings: {
        include: { job: { include: { customer: true } } },
      },
    },
  });

  if (!lead) {
    return NextResponse.json({ success: false, error: "Lead hittades inte" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: lead });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ success: false, error: "Ogiltig status" }, { status: 400 });
  }

  const lead = await prisma.lead.update({
    where: { id: Number(id) },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.notes !== undefined && { message: body.notes }),
    },
  });

  return NextResponse.json({ success: true, data: lead });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.lead.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
