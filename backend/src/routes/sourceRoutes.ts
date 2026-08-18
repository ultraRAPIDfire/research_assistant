import { Router } from "express";
import { pool } from "../db/database";

const router = Router();

/*
GET SOURCES FOR PROJECT
GET /api/sources/project/:projectId?search=
*/
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const search = String(req.query.search || "").trim();

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
    console.error("GET SOURCES ERROR:", error);

    res.status(500).json({
      error: "Failed to fetch sources",
    });
  }
});

/*
GET SINGLE SOURCE
GET /api/sources/:id
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM sources
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Source not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET SOURCE ERROR:", error);

    res.status(500).json({
      error: "Failed to fetch source",
    });
  }
});

/*
CREATE SOURCE
POST /api/sources/project/:projectId
*/
router.post("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      title,
      author,
      url,
      content,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const project = await pool.query(
      `
      SELECT id
      FROM projects
      WHERE id = $1
      `,
      [projectId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO sources
        (project_id, title, author, url, content)
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
    console.error("CREATE SOURCE ERROR:", error);

    res.status(500).json({
      error: "Failed to create source",
    });
  }
});

/*
UPDATE SOURCE
PUT /api/sources/:id
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      author,
      url,
      content,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE sources
      SET
        title = $1,
        author = $2,
        url = $3,
        content = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
      [
        title.trim(),
        author?.trim() || null,
        url?.trim() || null,
        content?.trim() || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Source not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE SOURCE ERROR:", error);

    res.status(500).json({
      error: "Failed to update source",
    });
  }
});

/*
DELETE SOURCE
DELETE /api/sources/:id
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM sources
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Source not found",
      });
    }

    res.json({
      message: "Source deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SOURCE ERROR:", error);

    res.status(500).json({
      error: "Failed to delete source",
    });
  }
});

export default router;