import { useState } from "react";
import type { FormEvent } from "react";

interface ProjectFormProps {
  onSubmit: (data: {
    title: string;
    research_question?: string;
    description?: string;
  }) => Promise<void>;

  onCancel?: () => void;
}

export default function ProjectForm({
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [researchQuestion, setResearchQuestion] =
    useState("");
  const [description, setDescription] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Project title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        title: title.trim(),
        research_question:
          researchQuestion.trim() || undefined,
        description:
          description.trim() || undefined,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="project-modal-backdrop">
      <div className="project-modal">
        <div className="project-modal-header">
          <div>
            <p className="project-modal-eyebrow">
              Research workspace
            </p>

            <h2>Create a new project</h2>

            <p>
              Organize your research, sources,
              and AI analysis in one workspace.
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              className="modal-close"
              onClick={onCancel}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        <form
          className="project-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="project-title">
              Project title
            </label>

            <input
              id="project-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Social Media & Student Productivity"
              disabled={saving}
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="research-question">
              Research question
            </label>

            <input
              id="research-question"
              value={researchQuestion}
              onChange={(event) =>
                setResearchQuestion(
                  event.target.value
                )
              }
              placeholder="What are you trying to investigate?"
              disabled={saving}
            />
          </div>

          <div className="field">
            <label htmlFor="project-description">
              Description
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Briefly describe the purpose and scope of your research..."
              rows={5}
              disabled={saving}
            />
          </div>

          <div className="project-form-footer">
            {onCancel && (
              <button
                type="button"
                className="button button-secondary"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}