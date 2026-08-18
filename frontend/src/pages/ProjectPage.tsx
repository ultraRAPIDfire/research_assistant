import { useEffect, useState } from "react";
import { api } from "../services/api";
import type {
  Project,
  Source,
} from "../services/api";
import SourceForm from "../components/SourceForm";

interface ProjectPageProps {
  projectId: number;
  onOpenSource: (id: number) => void;
}

export default function ProjectPage({
  projectId,
  onOpenSource,
}: ProjectPageProps) {
  const [project, setProject] =
    useState<Project | null>(null);

  const [sources, setSources] =
    useState<Source[]>([]);

  const [search, setSearch] =
    useState("");

  const [showSourceForm, setShowSourceForm] =
    useState(false);

  const [analysis, setAnalysis] =
    useState("");

  const [analyzing, setAnalyzing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        projectData,
        sourceData,
      ] = await Promise.all([
        api.getProject(projectId),
        api.getSources(
          projectId,
          search
        ),
      ]);

      setProject(projectData);
      setSources(sourceData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load project"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(
      loadData,
      250
    );

    return () =>
      clearTimeout(timer);
  }, [projectId, search]);

  async function handleCreateSource(
    data: {
      title: string;
      author?: string;
      url?: string;
      content?: string;
    }
  ) {
    const source =
      await api.createSource(
        projectId,
        data
      );

    setSources((current) => [
      source,
      ...current,
    ]);

    setShowSourceForm(false);

    setProject((current) =>
      current
        ? {
            ...current,
            source_count:
              (current.source_count ||
                0) + 1,
          }
        : current
    );
  }

  async function handleDeleteSource(
    sourceId: number
  ) {
    const confirmed =
      window.confirm(
        "Delete this research source?"
      );

    if (!confirmed) return;

    try {
      await api.deleteSource(
        sourceId
      );

      setSources((current) =>
        current.filter(
          (source) =>
            source.id !== sourceId
        )
      );

      setProject((current) =>
        current
          ? {
              ...current,
              source_count: Math.max(
                0,
                (current.source_count ||
                  1) - 1
              ),
            }
          : current
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete source"
      );
    }
  }

  async function handleAnalyzeProject() {
    try {
      setAnalyzing(true);
      setError("");

      const result =
        await api.analyzeProject(
          projectId
        );

      setAnalysis(
        result.analysis
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Project analysis failed"
      );
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading && !project) {
    return (
      <div className="card loading">
        Loading research project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error">
        Project not found.
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {project.title}
          </h1>

          <p className="page-subtitle">
            {project.research_question ||
              "No research question specified."}
          </p>
        </div>

        <button
          className="button button-ai"
          onClick={
            handleAnalyzeProject
          }
          disabled={
            analyzing ||
            sources.length === 0
          }
        >
          {analyzing
            ? "Analyzing..."
            : "✨ Analyze Research"}
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="card form-card">
        <strong>
          About this project
        </strong>

        <p
          style={{
            marginTop: 8,
            color: "#667085",
          }}
        >
          {project.description ||
            "No project description provided."}
        </p>
      </div>

      {showSourceForm && (
        <SourceForm
          onSubmit={
            handleCreateSource
          }
          onCancel={() =>
            setShowSourceForm(false)
          }
        />
      )}

      <div className="toolbar">
        <div>
          <h2 style={{ margin: 0 }}>
            Research Sources
          </h2>

          <p className="page-subtitle">
            {sources.length} source
            {sources.length === 1
              ? ""
              : "s"}
          </p>
        </div>

        <div className="button-row">
          <input
            className="search field"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search sources..."
            style={{
              padding: "11px 13px",
              border:
                "1px solid #d0d5dd",
              borderRadius: 10,
              outline: "none",
            }}
          />

          <button
            className="button button-primary"
            onClick={() =>
              setShowSourceForm(
                true
              )
            }
          >
            + Add Source
          </button>
        </div>
      </div>

      {sources.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            📚
          </div>

          <h2>
            No sources found
          </h2>

          <p>
            Add research papers,
            articles, notes, or other
            material to this project.
          </p>
        </div>
      ) : (
        <div className="source-list">
          {sources.map((source) => (
            <article
              className="card source-card"
              key={source.id}
            >
              <h3>
                {source.title}
              </h3>

              <div className="source-author">
                {source.author ||
                  "Unknown author"}
              </div>

              <p className="source-content-preview">
                {source.content
                  ? source.content.slice(
                      0,
                      220
                    ) +
                    (source.content
                      .length > 220
                      ? "..."
                      : "")
                  : "No content provided."}
              </p>

              <div className="button-row">
                <button
                  className="button button-primary"
                  onClick={() =>
                    onOpenSource(
                      source.id
                    )
                  }
                >
                  View Source
                </button>

                <button
                  className="button button-danger"
                  onClick={() =>
                    handleDeleteSource(
                      source.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {analysis && (
        <section className="ai-panel">
          <h2>
            ✨ Research Synthesis
          </h2>

          <div className="ai-result">
            {analysis}
          </div>
        </section>
      )}
    </div>
  );
}