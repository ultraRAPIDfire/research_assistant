import { useState } from "react";
import type { FormEvent } from "react";

interface SourceFormProps {
  onSubmit: (data: {
    title: string;
    author?: string;
    url?: string;
    content?: string;
  }) => Promise<void>;

  onCancel: () => void;
}

export default function SourceForm({ onSubmit, onCancel }: SourceFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Source title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        url: url.trim(),
        content: content.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save source");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card form-card dogear" onSubmit={handleSubmit}>
      <p className="eyebrow">New entry</p>
      <h2>Add Research Source</h2>

      {error && <div className="error">{error}</div>}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="src-title">Title</label>

          <input
            id="src-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Study on Student Productivity"
          />
        </div>

        <div className="field">
          <label htmlFor="src-author">Author</label>

          <input
            id="src-author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="John Smith"
          />
        </div>

        <div className="field">
          <label htmlFor="src-url">Source URL</label>

          <input
            id="src-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/research"
          />
        </div>

        <div className="field">
          <label htmlFor="src-content">Research content / notes</label>

          <textarea
            id="src-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Paste research text, notes, findings, or excerpts here..."
            style={{ minHeight: 240 }}
          />
        </div>

        <div className="button-row">
          <button className="button button-primary" disabled={saving}>
            {saving ? "Saving…" : "Add Source"}
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}