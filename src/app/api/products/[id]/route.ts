import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product) {
    return NextResponse.json({ success: false, error: "Produkten hittades inte" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: product });
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ success: false, error: "Ej behörig" }, { status: 401 });
  }

  const { id } = await params;
  const numId = parseInt(id);

  const existing = await prisma.product.findUnique({ where: { id: numId } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Produkten hittades inte" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { name, description, price, imageUrl, brand, featured } = body;

    if (!name?.trim() || !description?.trim() || price == null) {
      return NextResponse.json(
        { success: false, error: "Namn, beskrivning och pris krävs" },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { success: false, error: "Ogiltigt pris" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: numId },
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        imageUrl: imageUrl || null,
        brand: brand?.trim() || null,
        featured: featured ?? false,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Serverfel" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ success: false, error: "Ej behörig" }, { status: 401 });
  }

  const { id } = await params;
  const numId = parseInt(id);

  const existing = await prisma.product.findUnique({ where: { id: numId } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Produkten hittades inte" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id: numId } });
  return NextResponse.json({ success: true });
}
