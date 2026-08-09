import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env file");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not defined in .env file");
}

if (!process.env.SMTP_PASSWORD) {
  throw new Error("SMTP_PASSWORD is not defined in .env file");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is not defined in .env file");
}

if (!process.env.GOOGLE_REFRESH_TOKEN) {
  throw new Error("GOOGLE_REFRESH_TOKEN is not defined in .env file");
}

if (!process.env.GOOGLE_USER_EMAIL) {
  throw new Error("GOOGLE_USER_EMAIL is not defined in .env file");
}

if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("RAZORPAY_KEY_ID is not defined in .env file");
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("RAZORPAY_KEY_SECRET is not defined in .env file");
}

if (!process.env.BREVO_API) {
  throw new Error("BREVO_API is not defined in .env file");
}

const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER_EMAIL: process.env.GOOGLE_USER_EMAIL,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  BREVO_API: process.env.BREVO_API,
};

export default config;
