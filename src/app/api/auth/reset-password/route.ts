import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { generateResetToken } from "~/server/auth/tokens";
import { sendTemplateEmail } from "~/server/email";

interface EmailRequest {
  email: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as EmailRequest;
    const { email } = body;

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate reset token
    const token = await generateResetToken(email);

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`;

    // Send email using Mailtrap template
    await sendTemplateEmail({
      to: [email],
      templateUuid: "6975567f-c872-4ef0-9a24-26a2ef085522",
      templateVariables: {
        "company_info_name": "ToTrain",
        "name": user.firstName ?? email.split("@")[0] ?? "",
        "reset": resetUrl,
        "company_info_address": "123 Main St",
        "company_info_city": "San Francisco",
        "company_info_zip_code": "94105",
        "company_info_country": "USA"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 }
    );
  }
} 