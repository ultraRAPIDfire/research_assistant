import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError(
        "Please complete all required fields."
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    localStorage.setItem(
      "research_auth",
      "true"
    );

    navigate("/", {
      replace: true,
    });
  }

  return (
    <div className="auth-page">

      <div className="auth-decoration decoration-one" />
      <div className="auth-decoration decoration-two" />

      <div className="auth-layout">

        <section className="auth-brand-panel">
          <div className="auth-logo">
            🔬
          </div>

          <div className="auth-badge">
            ✨ Start researching
          </div>

          <h1>
            Build your
            <br />
            <span>research workspace.</span>
          </h1>

          <p>
            Keep your projects, sources,
            findings, and AI-assisted analysis
            organized in one place.
          </p>

          <div className="auth-feature-list">
            <div>
              <span>01</span>
              Create research projects
            </div>

            <div>
              <span>02</span>
              Collect and organize sources
            </div>

            <div>
              <span>03</span>
              Analyze everything with AI
            </div>
          </div>
        </section>

        <section className="auth-card">

          <div className="auth-card-header">
            <span className="auth-small-label">
              GET STARTED
            </span>

            <h2>
              Create account
            </h2>

            <p>
              Set up your research workspace.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            <label>
              Name

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
              />
            </label>

            <label>
              Email address

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
              />
            </label>

            <label>
              Confirm password

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              className="button button-primary auth-submit"
            >
              Create workspace →
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?

            <Link to="/login">
              Sign in
            </Link>
          </p>

        </section>

      </div>
    </div>
  );
}