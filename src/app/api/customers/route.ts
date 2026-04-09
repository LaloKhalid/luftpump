import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { validateCustomer } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { jobs: { select: { id: true, status: true, scheduledDate: true } } },
    }),
    prisma.customer.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: customers,
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
    const errors = validateCustomer(body);

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name: String(body.name).trim(),
        phone: String(body.phone).trim(),
        email: String(body.email).trim().toLowerCase(),
        address: String(body.address).trim(),
        notes: body.notes ? String(body.notes).trim() : null,
      },
    });

    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "En kund med denna e-post finns redan" },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: "Serverfel" }, { status: 500 });
  }
}
