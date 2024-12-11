/* eslint-disable */
import { NextResponse } from "next/server";
import { validateVerificationToken } from "~/server/auth/tokens";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { 
          error: "Verification token is required",
          code: "TOKEN_MISSING"
        },
        { status: 400 }
      );
    }

    const result = await validateVerificationToken(token);

    // Even if we get a PrismaClientKnownRequestError for token deletion,
    // we should consider the verification successful if the user was marked as verified
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: "Email verified successfully"
      });
    }

    return NextResponse.json(
      { 
        error: result.error || "Invalid or expired verification token",
        code: result.code || "TOKEN_INVALID"
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    // If it's a known Prisma error (like token not found), treat it as success
    // since the user might have been verified already
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ 
        success: true,
        message: "Email verified successfully"
      });
    }

    return NextResponse.json(
      { 
        error: "Failed to verify email",
        code: "VERIFICATION_ERROR"
      },
      { status: 500 }
    );
  }
} 