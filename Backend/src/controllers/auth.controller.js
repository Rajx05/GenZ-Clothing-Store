import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import otpModel from "../models/otp.model.js";
import { sendEmail } from "../services/email.service.js";
import {
  generateOtp,
  getOtpHtml,
  setRefreshTokenCookie,
} from "../utils/utils.js";

export async function register(req, res) {
  const { username, email, password } = req.body;
  const role = ["buyer", "seller"].includes(req.body.role)
    ? req.body.role
    : "buyer";

  const isRegistered = await userModel.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (isRegistered) {
    return res.status(409).json({
      message: "User already exists!",
    });
  }

  // Hash the password
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  // add user to Database
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  const otp = generateOtp();
  const html = getOtpHtml(otp);

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await otpModel.create({
    email,
    user: user._id,
    otpHash,
  });

  await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      role: user.role,
    },
  });
}

export async function login(req, res) {
  try {
    const { email, username, password } = req.body;
    console.log(req.body);
    const user = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    // Hash the password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.status(401).json({
        message: "Invalid password!",
      });
    }

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Save session to database
    const session = await sessionModel.create({
      userId: user._id,
      refreshTokenHash: refreshTokenHash,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    // Generate Access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, sessionId: session._id },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    // send refresh token as cookie
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({
      message: "Logged in successfully",
      accessToken: accessToken,
      user: {
        email: user.email,
        username: user.username,
        verified: user.verified,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Server error:", error);
  }
}

export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "refresh token not found !",
    });
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Find the session in the database
  const session = await sessionModel.findOne({
    refreshTokenHash: refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(404).json({
      message: "Session not found or already revoked!",
    });
  }
  // Revoke the session
  session.revoked = true;
  await session.save();

  // Clear the refresh token cookie
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Logged out successfully",
  });
}

export async function logoutAllSessions(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "refresh token not found !",
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  // Revoke all sessions for the user
  await sessionModel.updateMany(
    { userId: decoded.id, revoked: false },
    { $set: { revoked: true } },
  );

  // Clear the refresh token cookie
  res.clearCookie("refreshToken");
  res.status(200).json({
    message: "Logged out from all sessions successfully",
  });
}

export async function verifyOtp(req, res) {
  const { otp, email } = req.body;

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const otpDoc = await otpModel.findOne({
    email,
    otpHash,
  });

  if (!otpDoc) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  const user = await userModel.findByIdAndUpdate(otpDoc.user, {
    verified: true,
  });

  await otpModel.deleteMany({
    user: otpDoc.user,
  });

  return res.status(200).json({
    message: "Email verified successfully",
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
      role: user.role,
    },
  });
}

// GET /api/auth/get-new-access-token
export async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "refresh token not found !",
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
  const user = await userModel.findById(decoded.id);

  // console.log(decoded);

  // if (!user) {
  //   return res.status(404).json({
  //     message: "User not found!",
  //   });
  // }
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Find the session in the database
  const session = await sessionModel.findOne({
    refreshTokenHash: refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(404).json({
      message: "Session not found or already revoked!",
    });
  }

  const accessToken = jwt.sign(
    { id: decoded.id, role: decoded.role },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  // Generate a new Refresh Token
  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
      role: decoded.role,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  // Update the session with the new refresh token hash
  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  // send new refresh token
  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken: accessToken,
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
      role: user.role,
    },
  });
}

export async function verifyToken(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  // console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "invalid token",
    });
  }

  const decoded = jwt.verify(token, config.JWT_SECRET);
  const user = await userModel.findById(decoded.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found!",
    });
  }

  res.status(200).json({
    user: {
      username: user.username,
      email: user.email,
      verified: user.verified,
      role: user.role,
    },
  });
}
