// One-time setup route to create the first admin user
// Remove or protect this in production!
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, password, name, setupKey } = body;

    if (setupKey !== process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: "ADMIN" },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
