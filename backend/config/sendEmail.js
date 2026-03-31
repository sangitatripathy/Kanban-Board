import { createTransport } from "nodemailer";

export const sendEmail = async ({ email, subject, html }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html,
    });

  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
