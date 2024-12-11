import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { env } from "~/env";
import { BRAND } from "~/config/name";

export const transporter = nodemailer.createTransport(
  MailtrapTransport({
    token: env.MAILTRAP_PASS,
  })
);

interface SendTemplateEmailOptions {
  to: string[];
  templateUuid: string;
  templateVariables: Record<string, string>;
}

export async function sendTemplateEmail({ 
  to, 
  templateUuid, 
  templateVariables 
}: SendTemplateEmailOptions) {
  const sender = {
    address: `hello@totrain.app`,
    name: BRAND.name,
  };

  try {
    const result = await transporter.sendMail({
      from: sender,
      to,
      templateUuid: templateUuid,
      templateVariables: templateVariables,
    });
    return { success: true, result };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
} 