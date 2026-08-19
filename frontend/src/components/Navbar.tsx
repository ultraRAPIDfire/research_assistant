import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="brand"
          onClick={() => navigate("/")}
          aria-label="Go to home"
        >
          <span className="brand-icon">🔬</span>

          <span className="brand-text">
            AI Research Assistant
          </span>
        </button>

        <nav
          className="nav-links"
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
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