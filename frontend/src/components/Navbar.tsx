import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="brand"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="brand-mark">§</span>

          <span className="brand-text">
            <strong>AI Research Assistant</strong>
            <small>Archive &amp; Synthesis</small>
          </span>
        </button>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Login
          </NavLink>

          <button
            type="button"
            className="nav-register"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
}