import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage =
    (location.state as { message?: string } | null)?.message || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    localStorage.setItem("research_auth", "true");

    navigate("/", { replace: true });
  }

  return (
    <div className="auth-page">
      <div className="auth-decoration decoration-one" />
      <div className="auth-decoration decoration-two" />

      <div className="auth-layout">
        <section className="auth-brand-panel">
          <div className="auth-logo">§</div>

          <div className="auth-badge">Ledger · Access</div>

          <h1>
            Turn research
            <br />
            into <span>insight.</span>
          </h1>

          <p>
            Organize sources, analyze research, discover patterns, and
            generate better research questions with AI.
          </p>

          <div className="auth-feature-list">
            <div>
              <span>✓</span>
              Organize research projects
            </div>

            <div>
              <span>✓</span>
              Analyze research sources
            </div>

            <div>
              <span>✓</span>
              Discover common themes
            </div>
          </div>
        </section>

        <section className="auth-card dogear">
          <div className="auth-card-header">
            <span className="eyebrow">Welcome back</span>

            <h2>Sign in</h2>

            <p>Continue to your research workspace.</p>
          </div>

          {successMessage && (
            <div className="success">{successMessage}</div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>

            <button type="submit" className="button button-primary auth-submit">
              Sign in →
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <small>OR</small>
            <span />
          </div>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
}