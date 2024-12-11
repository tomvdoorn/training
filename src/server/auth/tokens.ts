import { randomBytes } from "crypto";
import { db } from "~/server/db";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

export async function generateVerificationToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  // Store the token in the database
  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

export async function generateResetToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  // Store the token in the database
  await db.passwordResetToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

interface ValidationResult {
  success: boolean;
  error?: string;
  code?: string;
  identifier?: string;
}

export async function validateVerificationToken(token: string): Promise<ValidationResult> {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return {
        success: false,
        error: "Token not found",
        code: "TOKEN_NOT_FOUND"
      };
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      try {
        await db.verificationToken.delete({
          where: { token },
        });
      } catch (error) {
        // Ignore deletion errors for expired tokens
        console.log("Failed to delete expired token:", error);
      }
      return {
        success: false,
        error: "Token has expired",
        code: "TOKEN_EXPIRED"
      };
    }

    try {
      // Mark user as verified
      await db.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      });

      // Try to delete the token, but don't fail if it's already deleted
      try {
        await db.verificationToken.delete({
          where: { token },
        });
      } catch (error) {
        // Log but don't fail if token deletion fails
        console.log("Failed to delete used token:", error);
      }

      return { success: true };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Check if the user is already verified
        const user = await db.user.findUnique({
          where: { email: verificationToken.identifier },
          select: { emailVerified: true }
        });

        if (user?.emailVerified) {
          return { success: true };
        }

        return {
          success: false,
          error: "Failed to verify email",
          code: "VERIFICATION_FAILED"
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("Error during token validation:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      code: "UNEXPECTED_ERROR"
    };
  }
}

export async function validateResetToken(token: string): Promise<ValidationResult> {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return {
        success: false,
        error: "Token not found",
        code: "TOKEN_NOT_FOUND"
      };
    }

    // Check if token has expired
    if (resetToken.expires < new Date()) {
      try {
        await db.passwordResetToken.delete({
          where: { token },
        });
      } catch (error) {
        console.log("Failed to delete expired token:", error);
      }
      return {
        success: false,
        error: "Token has expired",
        code: "TOKEN_EXPIRED"
      };
    }

    return { 
      success: true,
      identifier: resetToken.identifier 
    };
  } catch (error) {
    console.error("Error during reset token validation:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      code: "UNEXPECTED_ERROR"
    };
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<ValidationResult> {
  try {
    // First validate the token and get the user's email
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return {
        success: false,
        error: "Invalid or expired reset token",
        code: "TOKEN_INVALID"
      };
    }

    const hashedPassword = await hash(newPassword, 12);

    // Update password and delete token in a transaction
    await db.$transaction([
      db.user.update({
        where: { email: resetToken.identifier },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.delete({
        where: { token },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        error: "User not found",
        code: "USER_NOT_FOUND"
      };
    }
    return {
      success: false,
      error: "Failed to reset password",
      code: "RESET_FAILED"
    };
  }
} 