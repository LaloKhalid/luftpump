import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");

  if (!dateStr || isNaN(Date.parse(dateStr))) {
    return NextResponse.json({ success: false, error: "Ogiltigt datum" }, { status: 400 });
  }

  const date = new Date(dateStr);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const bookedSlots = await prisma.booking.findMany({
    where: { date: { gte: startOfDay, lte: endOfDay } },
    select: { time: true },
  });

  const bookedTimes = bookedSlots.map((b) => b.time);
  const available = TIME_SLOTS.filter((slot) => !bookedTimes.includes(slot));

  return NextResponse.json({ success: true, data: available });
}
