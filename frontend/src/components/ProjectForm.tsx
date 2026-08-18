import { useState } from "react";

interface ProjectFormProps {
  onSubmit: (data: {
    title: string;
    research_question?: string;
    description?: string;
  }) => Promise<void>;

  onCancel: () => void;
}

export default function ProjectForm({
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [title, setTitle] =
    useState("");

  const [researchQuestion, setResearchQuestion] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError(
        "Project title is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSubmit({
        title: title.trim(),
        research_question:
          researchQuestion.trim(),
        description:
          description.trim(),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="card form-card"
      onSubmit={handleSubmit}
    >
      <h2>
        Create Research Project
      </h2>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="form-grid">
        <div className="field">
          <label>
            Project title
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Effects of Social Media on Students"
          />
        </div>

        <div className="field">
          <label>
            Research question
          </label>

          <input
            value={researchQuestion}
            onChange={(event) =>
              setResearchQuestion(
                event.target.value
              )
            }
            placeholder="How does social media affect student productivity?"
          />
        </div>

        <div className="field">
          <label>
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Describe the purpose of this research project..."
          />
        </div>

        <div className="button-row">
          <button
            className="button button-primary"
            disabled={saving}
          >
            {saving
              ? "Creating..."
              : "Create Project"}
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