import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/database";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

function getJwtSecret(): string {
  return process.env.JWT_SECRET || "development-secret-change-this";
}

function createToken(userId: number) {
  return jwt.sign(
    { userId },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
}

function setAuthCookie(res: any, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

/* =====================================================
   REGISTER
===================================================== */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    const normalizedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (normalizedName.length === 0 || normalizedEmail.length === 0) {
      return res.status(400).json({
        error: "Name and email cannot be empty",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);

    const result = await pool.query(
      `
      INSERT INTO users
        (name, email, password_hash)
      VALUES
        ($1, $2, $3)
      RETURNING
        id,
        name,
        email,
        created_at
      `,
      [normalizedName, normalizedEmail, passwordHash]
    );

    const newUser = result.rows[0];
    const token = createToken(newUser.id);
    setAuthCookie(res, token);

    return res.status(201).json({
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      error: "Registration failed",
    });
  }
});

/* =====================================================
   LOGIN
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password_hash,
        created_at
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(String(password), user.password_hash);

    if (!valid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = createToken(user.id);
    setAuthCookie(res, token);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      error: "Login failed",
    });
  }
});

/* =====================================================
   LOGOUT
===================================================== */

router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.json({
    message: "Logged out successfully",
  });
});

/* =====================================================
   CURRENT USER
===================================================== */

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        created_at
      FROM users
      WHERE id = $1
      `,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    return res.json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);
    return res.status(500).json({
      error: "Failed to fetch current user",
    });
  }
});

export default router;