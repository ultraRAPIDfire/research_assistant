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

import { api } from "../services/api";

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

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
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

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      const result =
        await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
        });

      /*
       * Registration succeeded on the backend.
       *
       * We intentionally do not store an authentication
       * flag in localStorage. Authentication should come
       * from the backend session/cookie.
       */

      if (result.user) {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Account created successfully. Please sign in.",
          },
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-decoration decoration-one" />
      <div className="auth-decoration decoration-two" />

      <div className="auth-layout">

        <section className="auth-brand-panel">

          <div className="auth-logo">
            RA
          </div>

          <div className="auth-badge">
            RESEARCH WORKSPACE
          </div>

          <h1>
            Build your
            <br />
            <span>research workspace.</span>
          </h1>

          <p>
            Keep projects, sources, findings,
            and AI-assisted analysis organized
            in one place.
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
              Analyze your research with AI
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
                  setName(
                    event.target.value
                  )
                }
                placeholder="Your name"
                disabled={loading}
                autoComplete="name"
              />
            </label>

            <label>
              Email address

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@example.com"
                disabled={loading}
                autoComplete="email"
              />
            </label>

            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="At least 8 characters"
                disabled={loading}
                autoComplete="new-password"
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
                placeholder="Repeat your password"
                disabled={loading}
                autoComplete="new-password"
              />
            </label>

            <button
              type="submit"
              className="button button-primary auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?{" "}

            <Link to="/login">
              Sign in
            </Link>
          </p>

        </section>

      </div>

    </div>
  );
}