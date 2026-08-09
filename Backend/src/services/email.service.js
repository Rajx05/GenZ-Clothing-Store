import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(`${config.RESEND_API}`);

export const sendEmail = async (to, subject, text, html) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Genz Store",
          email: "rajeevnegi005@gmail.com",
        },

        to: [
          {
            email: to,
          },
        ],

        subject: subject,

        htmlContent: html,
      }),
    });

    console.log("Message sent: %s", response);
    // return response.data.json();
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
