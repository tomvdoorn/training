/* eslint-disable */
import { NextResponse } from "next/server";
import { sendTemplateEmail } from "~/server/email";
import { generateVerificationToken } from "~/server/auth/tokens";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    // Generate verification token
    const token = await generateVerificationToken(email);

    // Create verification URL with email parameter
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email using Mailtrap template
    await sendTemplateEmail({
      to: [email],
      templateUuid: "0438bdc9-3fb3-4bae-ab6d-38d2dcbd156f",
      templateVariables: {
        "company_info_name": "ToTrain",
        "name": name,
        "verification": verificationUrl,
        "company_info_address": "123 Main St",
        "company_info_city": "San Francisco",
        "company_info_zip_code": "94105",
        "company_info_country": "USA"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
} 