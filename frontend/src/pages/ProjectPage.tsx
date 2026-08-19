import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Project, Source } from "../services/api";
import SourceForm from "../components/SourceForm";

interface ProjectPageProps {
  projectId: number;
  onOpenSource: (id: number) => void;
}

export default function ProjectPage({
  projectId,
  onOpenSource,
}: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [search, setSearch] = useState("");
  const [showSourceForm, setShowSourceForm] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [projectData, sourceData] = await Promise.all([
        api.getProject(projectId),
        api.getSources(projectId, search),
      ]);

      setProject(projectData);
      setSources(sourceData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadData, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, search]);

  async function handleCreateSource(data: {
    title: string;
    author?: string;
    url?: string;
    content?: string;
  }) {
    try {
      const source = await api.createSource(projectId, data);

      setSources((current) => [source, ...current]);

      setShowSourceForm(false);

      setProject((current) =>
        current
          ? { ...current, source_count: (current.source_count || 0) + 1 }
          : current
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create source"
      );
    }
  }

  async function handleDeleteSource(sourceId: number) {
    const confirmed = window.confirm("Delete this research source?");

    if (!confirmed) return;

    try {
      await api.deleteSource(sourceId);

      setSources((current) =>
        current.filter((source) => source.id !== sourceId)
      );

      setProject((current) =>
        current
          ? {
              ...current,
              source_count: Math.max(0, (current.source_count || 1) - 1),
            }
          : current
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete source"
      );
    }
  }

  async function handleAnalyzeProject() {
    try {
      setAnalyzing(true);
      setError("");

      const result = await api.analyzeProject(projectId);

      setAnalysis(result.analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Project analysis failed"
      );
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading && !project) {
    return (
      <div className="project-page">
        <div className="project-loading">
          <div className="loading-spinner" />
          <p>Loading research project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-page">
        <div className="project-error">
          <h2>Project not found</h2>
          <p>This research project could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-page">
      {/* PROJECT HEADER */}
      <header className="project-hero dogear">
        <div className="project-hero-spine">
          <span>FILE</span>
        </div>

        <div className="project-hero-content">
          <div className="project-label eyebrow">Research project</div>

          <h1 className="project-title">{project.title}</h1>

          <p className="project-question">
            {project.research_question ||
              "No research question specified."}
          </p>

          <div className="project-meta">
            <div className="project-meta-item">
              <span className="meta-label">Sources</span>
              <strong>{project.source_count || 0}</strong>
            </div>

            <div className="project-meta-divider" />

            <div className="project-meta-item">
              <span className="meta-label">Created</span>
              <strong>
                {new Date(project.created_at).toLocaleDateString()}
              </strong>
            </div>
          </div>
        </div>

        <div className="project-hero-actions">
          <button
            className="project-ai-button"
            onClick={handleAnalyzeProject}
            disabled={analyzing || sources.length === 0}
          >
            {analyzing ? "Analyzing…" : "✨ Analyze Research"}
          </button>
        </div>
      </header>

      {/* ERROR */}
      {error && (
        <div className="project-error-banner">
          <span>{error}</span>
          <button onClick={() => setError("")}>Dismiss</button>
        </div>
      )}

      {/* PROJECT OVERVIEW */}
      <section className="project-overview">
        <div className="overview-heading">
          <div>
            <span className="eyebrow">Overview</span>
            <h2>About this project</h2>
          </div>
        </div>

        <p>
          {project.description ||
            "No project description has been added yet."}
        </p>
      </section>

      {/* SOURCE FORM */}
      {showSourceForm && (
        <div className="source-form-wrapper">
          <SourceForm
            onSubmit={handleCreateSource}
            onCancel={() => setShowSourceForm(false)}
          />
        </div>
      )}

      {/* SOURCES */}
      <section className="sources-section">
        <div className="sources-header">
          <div>
            <span className="eyebrow">Research library</span>
            <h2>Research Sources</h2>
            <p>Browse and manage the material connected to this project.</p>
          </div>

          <button
            className="add-source-button"
            onClick={() => setShowSourceForm(true)}
          >
            + Add Source
          </button>
        </div>

        <div className="sources-toolbar">
          <div className="source-count-label">
            {sources.length} {sources.length === 1 ? "source" : "sources"}
          </div>

          <div className="source-search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sources"
              className="source-search"
            />
          </div>
        </div>

        {sources.length === 0 ? (
          <div className="sources-empty">
            <div className="empty-mark">+</div>

            <h3>No research sources</h3>

            <p>
              Add papers, articles, notes, websites, or other research
              material to begin building your library.
            </p>

            <button
              className="add-source-button"
              onClick={() => setShowSourceForm(true)}
            >
              Add Your First Source
            </button>
          </div>
        ) : (
          <div className="source-grid">
            {sources.map((source, index) => (
              <article className="research-source-card" key={source.id}>
                <div className="source-spine">
                  <span>{String(index + 1).padStart(3, "0")}</span>
                </div>

                <div className="source-card-body">
                  <div className="source-card-top">
                    <div className="source-type">Source</div>

                    <button
                      className="source-delete"
                      onClick={() => handleDeleteSource(source.id)}
                      aria-label="Delete source"
                    >
                      Delete
                    </button>
                  </div>

                  <h3>{source.title}</h3>

                  <div className="source-author">
                    {source.author || "Unknown author"}
                  </div>

                  <p className="source-preview">
                    {source.content
                      ? source.content.slice(0, 220) +
                        (source.content.length > 220 ? "..." : "")
                      : "No content provided."}
                  </p>

                  <div className="source-card-footer">
                    <span>
                      {new Date(source.created_at).toLocaleDateString()}
                    </span>

                    <button
                      className="view-source-button"
                      onClick={() => onOpenSource(source.id)}
                    >
                      View Source
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* AI ANALYSIS */}
      {analysis && (
        <section className="research-synthesis">
          <div className="synthesis-stamp">AI Reviewed</div>

          <div className="synthesis-header">
            <div>
              <span className="eyebrow">AI analysis</span>
              <h2>Research Synthesis</h2>
              <p>
                An AI-generated synthesis based on the sources in this
                project.
              </p>
            </div>

            <button
              className="synthesis-refresh"
              onClick={handleAnalyzeProject}
              disabled={analyzing}
            >
              {analyzing ? "Updating…" : "Regenerate"}
            </button>
          </div>

          <div className="synthesis-content">{analysis}</div>
        </section>
      )}
    </div>
  );
}