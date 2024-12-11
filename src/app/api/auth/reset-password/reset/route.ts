import { NextResponse } from "next/server";
import { resetPassword } from "~/server/auth/tokens";

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface EmailRequest {
  email: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as ResetPasswordRequest;
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { 
          error: "Token and password are required",
          code: "MISSING_FIELDS"
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { 
          error: "Password must be at least 8 characters long",
          code: "INVALID_PASSWORD"
        },
        { status: 400 }
      );
    }

    const result = await resetPassword(token, password);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error ?? "Failed to reset password",
          code: result.code
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { 
        error: "Failed to reset password",
        code: "RESET_ERROR"
      },
      { status: 500 }
    );
  }
} 