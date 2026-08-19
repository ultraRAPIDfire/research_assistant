import { Router } from "express";
import { pool } from "../db/database";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// Protect all project routes
router.use(requireAuth);

router.get("/:projectId/sources", async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const search = String(req.query.search || "").trim();

    const project = await pool.query(
      `
      SELECT id
      FROM projects
      WHERE id = $1 AND user_id = $2
      `,
      [projectId, req.userId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM sources
      WHERE project_id = $1
      AND (
        $2 = ''
        OR title ILIKE '%' || $2 || '%'
        OR author ILIKE '%' || $2 || '%'
        OR content ILIKE '%' || $2 || '%'
      )
      ORDER BY created_at DESC
      `,
      [projectId, search]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET PROJECT SOURCES ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch project sources",
    });
  }
});

router.post("/:projectId/sources", async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const { title, author, url, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const project = await pool.query(
      `
      SELECT id
      FROM projects
      WHERE id = $1 AND user_id = $2
      `,
      [projectId, req.userId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO sources
        (
          project_id,
          title,
          author,
          url,
          content
        )
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        projectId,
        title.trim(),
        author?.trim() || null,
        url?.trim() || null,
        content?.trim() || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE PROJECT SOURCE ERROR:", error);
    res.status(500).json({
      error: "Failed to create source",
    });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.*,
        COUNT(s.id)::int AS source_count
      FROM projects p
      LEFT JOIN sources s
        ON s.project_id = p.id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch projects",
    });
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM projects
      WHERE id = $1 AND user_id = $2
      `,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET PROJECT ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch project",
    });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { title, research_question, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO projects
        (title, research_question, description, user_id)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        title.trim(),
        research_question || null,
        description || null,
        req.userId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({
      error: "Failed to create project",
    });
  }
});

router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, research_question, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE projects
      SET
        title = $1,
        research_question = $2,
        description = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING *
      `,
      [
        title.trim(),
        research_question || null,
        description || null,
        id,
        req.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    res.status(500).json({
      error: "Failed to update project",
    });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM projects
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    res.status(500).json({
      error: "Failed to delete project",
    });
  }
});

export default router;