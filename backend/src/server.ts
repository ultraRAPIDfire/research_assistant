import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { pool } from "./db/database";

import projectRoutes from "./routes/projectRoutes";
import sourceRoutes from "./routes/sourceRoutes";
import aiRoutes from "./routes/aiRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    message: "AI Research Assistant API is running",
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    const result =
      await pool.query("SELECT NOW()");

    res.json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/auth", authRoutes);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/sources",
  sourceRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});