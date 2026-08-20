import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // check for bearer token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    // verify token signature and expiration
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Attach decoded user payload from token to req.user
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, invalid or expired token" });
  }
};
