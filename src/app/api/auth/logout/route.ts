import { NextResponse } from "next/server";
import { COOKIE_CONFIG } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_CONFIG.name);
  return response;
}
