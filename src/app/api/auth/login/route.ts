import { NextRequest, NextResponse } from "next/server";
import { loginUser, COOKIE_CONFIG } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "E-post och lösenord krävs" },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);
    if (!result) {
      return NextResponse.json(
        { success: false, error: "Felaktig e-post eller lösenord" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: { user: result.user },
    });

    response.cookies.set(
      COOKIE_CONFIG.name,
      result.token,
      COOKIE_CONFIG.options
    );

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Serverfel" },
      { status: 500 }
    );
  }
}
