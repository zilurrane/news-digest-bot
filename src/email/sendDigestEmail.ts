// src/email/sendDigestEmail.ts
import nodemailer from "nodemailer";

export async function sendDigestEmail(topicsWithArticleTitles: any[]): Promise<void> {
  const mailBody = getFormattedMailBody(topicsWithArticleTitles);
  console.log(mailBody)
  await sendEmail(mailBody);
}

const getFormattedMailBody = (topicsWithArticleTitles: any[]) => {
  let mailBody = "";
  for (let i = 0; i < topicsWithArticleTitles.length; i++) {
    const topic = topicsWithArticleTitles[i];
    const summaryData = topic.summary.map((s: string, j: number) => `${j+1}. ${s}`).join("\n")
    mailBody = mailBody + "\n" + topic.keyword + "\n" + summaryData;
  }
  return mailBody;
}

async function sendEmail(mailBody: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

 const mailResponse = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Your X Trending Digest",
    text: mailBody,
  });

  console.log("Mail Sent", mailResponse);

}

