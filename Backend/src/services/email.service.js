import { google } from "googleapis";
import config from "../config/config.js";

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
);

// Set the refresh token
oAuth2Client.setCredentials({
  refresh_token: config.GOOGLE_REFRESH_TOKEN,
});

// Initialize Gmail API instance
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

export const sendEmail = async (to, subject, text, html) => {
  try {
    // 1. Construct the raw MIME message string
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;

    // Choose HTML body if provided, fallback to plain text
    const bodyContent = html
      ? `Content-Type: text/html; charset=utf-8\n\n${html}`
      : `Content-Type: text/plain; charset=utf-8\n\n${text || ""}`;

    const messageParts = [
      `From: "Rajeev Negi" <${config.GOOGLE_USER_EMAIL}>`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      "MIME-Version: 1.0",
      bodyContent,
    ];

    const message = messageParts.join("\n");

    // 2. Base64url encode the MIME message for Google's API
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 3. Send email over HTTPS (Port 443)
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Message sent: %s", response.data.id);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
