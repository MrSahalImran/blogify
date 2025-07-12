import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "./api-errors.js";

export const sendEmail = async (to, username, token) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Blogify",
      link: "https://test.com",
    },
  });

  const htmlEmailBody = mailGenerator.generate(
    forgotPasswordContent(username, token)
  );

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mail = {
    from: "help@blogify.com",
    to: to,
    subject: "password reset",
    html: htmlEmailBody,
  };

  try {
    await transport.sendMail(mail);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new ApiError(500, "Could not send email");
  }
};

const forgotPasswordContent = (username, passwordResetToken) => {
  return {
    body: {
      name: username,
      intro:
        "You are receiving this email because you have requested a password reset.",

      action: {
        instructions:
          "Please click the button below or paste the link into your browser to complete the process",
        button: {
          color: "#ff5349",
          text: "Reset password",
          link: `http://localhost:9080/api/v1/user/reset-password/${passwordResetToken}`,
        },
      },
      outro: "Need help? Just reply to this email!!!.",
    },
  };
};
