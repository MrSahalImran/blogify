import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "./api-errors.js";

export const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Blogify",
      link: "https://test.com",
    },
  });

  const htmlEmailBody = mailGenerator.generate(options.mailType);

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mail = {
    from: "help@blogify.com",
    to: options.to,
    subject: options.subject,
    html: htmlEmailBody,
  };

  try {
    await transport.sendMail(mail);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new ApiError(500, "Could not send email");
  }
};

export const forgotPasswordContent = (username, passwordResetToken) => {
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

export const emailVerificationContent = (username, verificationToken) => {
  return {
    body: {
      name: username,
      intro:
        "You are receiving this email because you have registered on Blogify.",

      action: {
        instructions:
          "Please click the button below or paste the link into your browser to verify your email address",
        button: {
          color: "#7ef74eff",
          text: "Verify Email",
          link: `http://localhost:9080/api/v1/user/account-verification/${verificationToken}`,
        },
      },
      outro: "Need help? Just reply to this email!!!.",
    },
  };
};
