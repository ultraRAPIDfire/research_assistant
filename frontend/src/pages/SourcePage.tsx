import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Source } from "../services/api";

interface SourcePageProps {
  sourceId: number;
}

export default function SourcePage({ sourceId }: SourcePageProps) {
  const [source, setSource] = useState<Source | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  async function loadSource() {
    try {
      setLoading(true);
      setError("");

      const data = await api.getSource(sourceId);

      setSource(data);

      setTitle(data.title);
      setAuthor(data.author || "");
      setUrl(data.url || "");
      setContent(data.content || "");

      // Clear analysis when opening/reloading a different source.
      setAnalysis("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load source");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceId]);

  async function handleSave() {
    if (!title.trim()) {
      setError("Source title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updated = await api.updateSource(sourceId, {
        title: title.trim(),
        author: author.trim(),
        url: url.trim(),
        content,
      });

      setSource(updated);

      setTitle(updated.title);
      setAuthor(updated.author || "");
      setUrl(updated.url || "");
      setContent(updated.content || "");

      setEditing(false);

      // Existing AI analysis may no longer match the updated source.
      setAnalysis("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update source"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAnalyze() {
    if (!source) {
      return;
    }

    if (!source.content?.trim()) {
      setError(
        "This source does not contain any research content to analyze."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setAnalysis("");

      const result = await api.analyzeSource(sourceId);

      setAnalysis(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDelete() {
    if (!source) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${source.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await api.deleteSource(source.id);

      // Return to the project page.
      window.location.href = `/projects/${source.project_id}`;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete source"
      );
      setDeleting(false);
    }
  }

  function handleCancelEdit() {
    if (!source) {
      return;
    }

    setTitle(source.title);
    setAuthor(source.author || "");
    setUrl(source.url || "");
    setContent(source.content || "");

    setEditing(false);
    setError("");
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card loading">
          <div className="loading-spinner" />
          <p>Loading research source...</p>
        </div>
      </div>
    );
  }

  if (!source) {
    return (
      <div className="page">
        <div className="card empty-state">
          <div className="empty-icon">📄</div>
          <h2>Source not found</h2>
          <p>
            This research source may have been deleted or no longer exists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page source-page">
      {/* HEADER */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="badge">Research Source</div>

          <h1 className="page-title">{source.title}</h1>

          <p className="page-subtitle">
            {source.author ? `By ${source.author}` : "Author unknown"}
          </p>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              if (editing) {
                handleCancelEdit();
              } else {
                setEditing(true);
                setError("");
              }
            }}
            disabled={saving || deleting || analyzing}
          >
            {editing ? "Cancel Edit" : "Edit Source"}
          </button>

          <button
            type="button"
            className="button button-ai"
            onClick={handleAnalyze}
            disabled={
              analyzing || saving || deleting || !source.content?.trim()
            }
          >
            {analyzing ? "✨ Analyzing..." : "✨ Analyze with AI"}
          </button>

          <button
            type="button"
            className="button button-danger"
            onClick={handleDelete}
            disabled={deleting || saving || analyzing}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-banner">
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>

          <button
            type="button"
            className="error-close"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* EDIT FORM */}
      {editing ? (
        <div className="card form-card dogear">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Edit source</span>
              <h2>Source information</h2>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="source-title">Title</label>

              <input
                id="source-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Research source title"
                disabled={saving}
              />
            </div>

            <div className="field">
              <label htmlFor="source-author">Author</label>

              <input
                id="source-author"
                type="text"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Author name"
                disabled={saving}
              />
            </div>

            <div className="field">
              <label htmlFor="source-url">Source URL</label>

              <input
                id="source-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/research"
                disabled={saving}
              />
            </div>

            <div className="field">
              <div className="field-label-row">
                <label htmlFor="source-content">Research Content</label>

                <span className="character-count">
                  {content.length.toLocaleString()} characters
                </span>
              </div>

              <textarea
                id="source-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Paste the research material here..."
                disabled={saving}
                rows={18}
              />
            </div>

            <div className="button-row form-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={handleSave}
                disabled={saving || !title.trim()}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* SOURCE INFORMATION */}
          <div className="card source-info-card dogear">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Source details</span>
                <h2>Source Information</h2>
              </div>
            </div>

            <div className="source-meta-grid">
              <div className="source-meta">
                <span>Title</span>
                <strong>{source.title}</strong>
              </div>

              <div className="source-meta">
                <span>Author</span>
                <strong>{source.author || "Unknown"}</strong>
              </div>

              <div className="source-meta">
                <span>Added</span>
                <strong>
                  {new Date(source.created_at).toLocaleDateString()}
                </strong>
              </div>

              {source.url && (
                <div className="source-meta">
                  <span>URL</span>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    Open source ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* RESEARCH CONTENT */}
          <div className="card content-card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Research material</span>
                <h2>Research Content</h2>
              </div>

              <span className="content-count">
                {source.content
                  ? `${source.content.length.toLocaleString()} characters`
                  : "No content"}
              </span>
            </div>

            <div className="research-content">
              {source.content ? (
                source.content
              ) : (
                <div className="content-empty">
                  <span>📝</span>

                  <p>No research content was provided for this source.</p>

                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => setEditing(true)}
                  >
                    Add Content
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* AI ANALYSIS */}
      {analysis && (
        <section className="ai-panel">
          <div className="synthesis-stamp">AI Reviewed</div>

          <div className="ai-panel-header">
            <div>
              <span className="eyebrow">AI research assistant</span>
              <h2>✨ AI Analysis</h2>
            </div>

            <button
              type="button"
              className="button button-ai-outline"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Run Again"}
            </button>
          </div>

          <div className="ai-result">{analysis}</div>

          <div className="ai-disclaimer">
            AI-generated analysis is based only on the research material
            provided to the assistant. Verify important claims against the
            original source.
          </div>
        </section>
      )}
    </div>
  );
}