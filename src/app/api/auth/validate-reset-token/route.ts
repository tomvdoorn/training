import { NextResponse } from "next/server";
import { validateResetToken } from "~/server/auth/tokens";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { token: string };
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { 
          error: "Token is required",
          code: "TOKEN_MISSING"
        },
        { status: 400 }
      );
    }

    const result = await validateResetToken(token);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error ?? "Invalid or expired token",
          code: result.code
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error validating reset token:", error);
    return NextResponse.json(
      { 
        error: "Failed to validate token",
        code: "VALIDATION_ERROR"
      },
      { status: 500 }
    );
  }
} 