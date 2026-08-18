import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Project } from "../services/api";
import ProjectForm from "../components/ProjectForm";

interface DashboardProps {
  onOpenProject: (id: number) => void;
}

export default function Dashboard({
  onOpenProject,
}: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data = await api.getProjects();

      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleCreateProject() {
    setError("");
    setShowForm(true);
  }

  function handleCloseForm() {
    if (!creating) {
      setShowForm(false);
    }
  }

  async function handleCreate(data: {
    title: string;
    research_question?: string;
    description?: string;
  }) {
    try {
      setCreating(true);
      setError("");

      const project = await api.createProject(data);

      setProjects((current) => [
        project,
        ...current,
      ]);

      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project"
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"?\n\nThis will also remove its research sources.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.deleteProject(project.id);

      setProjects((current) =>
        current.filter(
          (item) => item.id !== project.id
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete project"
      );
    }
  }

  function scrollToProjects() {
    document
      .getElementById("projects")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">

          <div className="hero-badge">
            <span>✨</span>
            AI-powered research workspace
          </div>

          <h1 className="hero-title">
            Research smarter.
            <br />
            <span>Discover more.</span>
          </h1>

          <p className="hero-description">
            Organize your research projects, manage
            sources, and use AI to uncover summaries,
            key findings, research questions, and
            connections across your sources.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary button-large"
              onClick={handleCreateProject}
            >
              + Create Research Project
            </button>

            <button
              type="button"
              className="button button-secondary button-large"
              onClick={scrollToProjects}
            >
              View Projects
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{projects.length}</strong>
              <span>Projects</span>
            </div>

            <div className="hero-stat">
              <strong>
                {projects.reduce(
                  (total, project) =>
                    total + (project.source_count || 0),
                  0
                )}
              </strong>
              <span>Sources</span>
            </div>

            <div className="hero-stat">
              <strong>AI</strong>
              <span>Analysis</span>
            </div>
          </div>

        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="section"
      >
        <div className="section-header">
          <div>
            <div className="section-eyebrow">
              WORKSPACE
            </div>

            <h2 className="section-title">
              Your Research Projects
            </h2>

            <p className="section-subtitle">
              Organize your sources and research
              in one place.
            </p>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={handleCreateProject}
          >
            + New Project
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="error">
            <strong>Something went wrong.</strong>
            <span>{error}</span>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => setError("")}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" />

            <h2>
              Loading your research...
            </h2>

            <p>
              Getting your projects ready.
            </p>
          </div>
        ) : projects.length === 0 ? (

          /* EMPTY STATE */
          <div className="empty-state">
            <div className="empty-icon">
              🔬
            </div>

            <h2>
              No research projects yet
            </h2>

            <p>
              Create your first research project
              to start collecting sources and
              analyzing your research with AI.
            </p>

            <button
              type="button"
              className="button button-primary"
              onClick={handleCreateProject}
            >
              Create Your First Project
            </button>
          </div>

        ) : (

          /* PROJECT GRID */
          <div className="project-grid">
            {projects.map((project) => (
              <article
                className="project-card"
                key={project.id}
              >
                <div className="project-card-header">
                  <div className="project-icon">
                    📚
                  </div>

                  <span className="project-status">
                    Active
                  </span>
                </div>

                <h3 className="project-card-title">
                  {project.title}
                </h3>

                <p className="project-card-description">
                  {project.description ||
                    project.research_question ||
                    "Research project"}
                </p>

                {project.research_question && (
                  <div className="research-question">
                    <span className="question-label">
                      Research question
                    </span>

                    <p>
                      {project.research_question}
                    </p>
                  </div>
                )}

                <div className="project-card-footer">
                  <span className="source-count">
                    📄{" "}
                    {project.source_count || 0}{" "}
                    {project.source_count === 1
                      ? "source"
                      : "sources"}
                  </span>

                  <div className="project-actions">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() =>
                        handleDelete(project)
                      }
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() =>
                        onOpenProject(project.id)
                      }
                    >
                      Open →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CREATE PROJECT MODAL */}
      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !creating
            ) {
              handleCloseForm();
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="section-eyebrow">
                  NEW PROJECT
                </div>

                <h2>
                  Create Research Project
                </h2>

                <p>
                  Set up your research workspace.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={handleCloseForm}
                disabled={creating}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <ProjectForm
              onSubmit={handleCreate}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}