import { Router } from "express";
import { pool } from "../db/database";
import {
  analyzeSource,
  analyzeProject,
} from "../services/aiService";

const router = Router();

/*
ANALYZE SOURCE
POST /api/ai/analyze-source
*/
router.post("/analyze-source", async (req, res) => {
  try {
    const { sourceId } = req.body;

    if (!sourceId) {
      return res.status(400).json({
        error: "sourceId is required",
      });
    }

    const result = await pool.query(
      `
      SELECT title, content
      FROM sources
      WHERE id = $1
      `,
      [sourceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Source not found",
      });
    }

    const source = result.rows[0];

    if (!source.content) {
      return res.status(400).json({
        error: "This source has no content to analyze.",
      });
    }

    const analysis = await analyzeSource(
      source.title,
      source.content
    );

    res.json({
      sourceId,
      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Source analysis failed",
    });
  }
});

/*
ANALYZE PROJECT
POST /api/ai/analyze-project
*/
router.post("/analyze-project", async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        error: "projectId is required",
      });
    }

    const projectResult = await pool.query(
      `
      SELECT *
      FROM projects
      WHERE id = $1
      `,
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const sourceResult = await pool.query(
      `
      SELECT
        title,
        author,
        content
      FROM sources
      WHERE project_id = $1
      ORDER BY created_at
      `,
      [projectId]
    );

    if (sourceResult.rows.length === 0) {
      return res.status(400).json({
        error:
          "This project has no research sources.",
      });
    }

    const project = projectResult.rows[0];

    const analysis = await analyzeProject(
      project.title,
      project.research_question || "",
      sourceResult.rows
    );

    res.json({
      projectId,
      analysis,
    });
  } catch (error) {
    console.error("AI PROJECT ANALYSIS ERROR:", error);

    res.status(500).json({
      error: "Project analysis failed",
    });
  }
});

export default router;  