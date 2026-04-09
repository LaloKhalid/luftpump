import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: products });
  } catch {
    return NextResponse.json({ success: false, error: "Serverfel" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ success: false, error: "Ej behörig" }, { status: 401 });
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

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        imageUrl: imageUrl || null,
        brand: brand?.trim() || null,
        featured: featured ?? false,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Serverfel" }, { status: 500 });
  }
}
