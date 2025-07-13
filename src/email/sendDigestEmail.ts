// src/email/sendDigestEmail.ts
import nodemailer from "nodemailer";

export async function sendDigestEmail(digestText: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Your X Trending Digest",
    text: digestText,
  });
}
