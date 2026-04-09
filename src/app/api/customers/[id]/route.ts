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
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
    include: {
      jobs: {
        include: { booking: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    return NextResponse.json({ success: false, error: "Kund hittades inte" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: customer });
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

  const customer = await prisma.customer.update({
    where: { id: Number(id) },
    data: {
      ...(body.name && { name: String(body.name).trim() }),
      ...(body.phone && { phone: String(body.phone).trim() }),
      ...(body.email && { email: String(body.email).trim().toLowerCase() }),
      ...(body.address && { address: String(body.address).trim() }),
      ...(body.notes !== undefined && { notes: body.notes }),
    },
  });

  return NextResponse.json({ success: true, data: customer });
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
  await prisma.customer.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
