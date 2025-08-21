import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "./api-errors.js";

export const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Whiteboard",
      link: "https://test.com",
    },
  });

  const htmlEmailBody = mailGenerator.generate(options.mailType);

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mail = {
    from: "help@whiteboard.com",
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
      intro: "You are receiving this email because you have registered .",

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

export const eventRegistrationContent = (username, event) => {
  return {
    body: {
      name: username,
      intro: `You have successfully registered for the event ${event.name}.`,
      table: {
        data: [
          {
            Event: event.name,
            Description: event.description,
            Date: new Date(event.datetime).toLocaleString(),
          },
        ],
        columns: {
          customWidth: {
            Event: "30%",
            Description: "50%",
            Date: "20%",
          },
        },
      },
      action: {
        instructions:
          "You can join the event using the official platform when it starts.",
        button: {
          color: "#0d6efd",
          text: "View Event Details",
          link: `http://localhost:3000/api/v1/events/${event._id}`,
        },
      },
      outro: "We're excited to have you there!",
    },
  };
};
