import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id: Number(id) },
    include: {
      customer: true,
      booking: { include: { lead: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ success: false, error: "Jobb hittades inte" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: job });
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

  const job = await prisma.job.update({
    where: { id: Number(id) },
    data: {
      ...(body.technician !== undefined && { technician: body.technician }),
      ...(body.status && { status: body.status }),
      ...(body.scheduledDate !== undefined && {
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
      }),
      ...(body.notes !== undefined && { notes: body.notes }),
    },
    include: {
      customer: true,
      booking: true,
    },
  });

  return NextResponse.json({ success: true, data: job });
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
  await prisma.job.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
