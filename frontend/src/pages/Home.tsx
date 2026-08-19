import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot" />
            AI-powered research workspace
          </div>

          <h1>
            Research smarter.
            <br />
            <span>Discover more.</span>
          </h1>

          <p className="hero-description">
            Organize your research, manage sources, and use AI to uncover
            important findings, themes, questions, and research gaps.
          </p>

          <div className="hero-actions">
            <button
              className="button button-primary button-large"
              onClick={() => navigate("/register")}
            >
              Start Researching
              <span>→</span>
            </button>

            <button
              className="button button-secondary button-large"
              onClick={() => navigate("/dashboard")}
            >
              View Dashboard
            </button>
          </div>

          <div className="hero-trust">
            <span>Organize sources</span>
            <span>AI-powered analysis</span>
            <span>Research synthesis</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="research-preview dogear">
            <div className="preview-spine">
              <span>FILE</span>
            </div>

            <div className="preview-body">
              <div className="preview-header">
                <div>
                  <span className="preview-label">Research Project · No. 014</span>
                  <h3>Social Media &amp; Students</h3>
                </div>

                <span className="preview-ai">✨ AI</span>
              </div>

              <div className="preview-question">
                <span>Research Question</span>
                <p>How does social media affect student productivity?</p>
              </div>

              <div className="preview-stats">
                <div>
                  <strong>12</strong>
                  <span>Sources</span>
                </div>

                <div>
                  <strong>5</strong>
                  <span>Key Findings</span>
                </div>

                <div>
                  <strong>8</strong>
                  <span>Questions</span>
                </div>
              </div>

              <div className="preview-analysis">
                <div className="analysis-icon">✨</div>

                <div>
                  <strong>AI Research Synthesis</strong>
                  <p>4 major themes identified across your sources.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-title">
          <span className="eyebrow">Everything in one place</span>

          <h2>Your complete research workspace</h2>

          <p>
            From collecting sources to discovering research gaps, keep your
            entire research workflow organized.
          </p>
        </div>

        <div className="feature-grid">
          <Feature
            index="01"
            icon="📚"
            title="Research Projects"
            description="Create and organize projects around your research questions."
          />

          <Feature
            index="02"
            icon="🔗"
            title="Source Management"
            description="Store papers, articles, notes, authors, URLs, and research material."
          />

          <Feature
            index="03"
            icon="✨"
            title="AI Analysis"
            description="Summarize sources and extract important findings automatically."
          />

          <Feature
            index="04"
            icon="🧠"
            title="Research Synthesis"
            description="Compare multiple sources and discover common themes and gaps."
          />

          <Feature
            index="05"
            icon="🔎"
            title="Smart Search"
            description="Quickly find the sources and research material you need."
          />

          <Feature
            index="06"
            icon="💡"
            title="Research Questions"
            description="Generate useful research questions from your collected evidence."
          />
        </div>
      </section>

      <section className="cta-section dogear">
        <div>
          <span className="eyebrow">Ready to start?</span>

          <h2>Turn your research into insights.</h2>

          <p>
            Build your research workspace and let AI help you understand your
            sources.
          </p>
        </div>

        <button
          className="button button-primary button-large"
          onClick={() => navigate("/register")}
        >
          Create Your Workspace →
        </button>
      </section>
    </div>
  );
}

function Feature({
  index,
  icon,
  title,
  description,
}: {
  index: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-top">
        <div className="feature-icon">{icon}</div>
        <span className="feature-index">{index}</span>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}