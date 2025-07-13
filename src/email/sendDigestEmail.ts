// src/email/sendDigestEmail.ts
import nodemailer from "nodemailer";

export async function sendDigestEmail(topicsWithArticleTitles: any[]): Promise<void> {
  const mailBody = getFormattedMailBody(topicsWithArticleTitles);
  await sendEmail(mailBody);
}

const getFormattedMailBody = (topicsWithArticleTitles: any[]) => {
  let mailBody = `
  <div style="
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #111;
    margin: 0 auto;
    padding: 15px;
    background: #f0f0f5;
  ">
    <h1 style="
      text-align: center;
      color: #2b2e7f;
      margin-bottom: 24px;
    ">
      📰 Your Trending News Digest 📰
    </h1>
  `;

  for (let i = 0; i < topicsWithArticleTitles.length; i++) {
    const topic = topicsWithArticleTitles[i];

    const summaryData = topic.summary
      .map(
        (s: string, j: number) =>
          `<li style="margin-bottom: 10px;">${s}</li>`
      )
      .join("");

    mailBody += `
      <div style="
        border-radius: 0px;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid #e0e0eb;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        margin: 10px auto;
        max-width: 700px;
      ">
        <div style="
          padding: 15px 5px;
        ">
          <h3 style="
            margin: 0 0 12px 0;
            color: #2b2e7f;
            font-size: 18px;
            padding-left: 40px;
          ">
            # Topic: ${topic.keyword}
          </h3>
          <ol style="
            margin: 0;
            color: #333;
          ">
            ${summaryData}
          </ol>
        </div>
      </div>
    `;
  }

  mailBody += `
    <p style="
      text-align: center;
      color: #888;
      font-size: 14px;
      margin-top: 32px;
    ">
      End of Digest
    </p>
  </div>
  `;

  return mailBody;
};

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
    subject: "Trending News Digest",
    html: mailBody, // Use HTML here
  });
  if (mailResponse?.accepted?.length > 0) {
    console.log("Mail Sent");
  } else {
    console.log("Error sending email => ", mailResponse);
  }
}

