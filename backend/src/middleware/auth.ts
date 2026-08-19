import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "development-secret-change-this";
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.cookies?.token;

    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const payload = jwt.verify(
      token,
      getJwtSecret()
    ) as {
      userId: number;
    };

    if (!payload?.userId) {
      return res.status(401).json({
        error: "Invalid token payload",
      });
    }

    req.userId = payload.userId;

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired session",
    });
  }
}