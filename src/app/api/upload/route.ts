import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Ingen fil skickad" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Endast JPG, PNG, WebP och GIF är tillåtna" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Filen får inte vara större än 5 MB" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop();
    const filename = `${randomUUID()}.${ext}`;

    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({ success: true, data: { url: blob.url } });
  } catch {
    return NextResponse.json({ success: false, error: "Uppladdning misslyckades" }, { status: 500 });
  }
}
