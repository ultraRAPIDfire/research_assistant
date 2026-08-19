import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="brand"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
          aria-label="Go to dashboard"
        >
          <span className="brand-mark">§</span>

          <span className="brand-text">
            <strong>AI Research Assistant</strong>
            <small>Archive &amp; Synthesis</small>
          </span>
        </button>

        <nav className="nav-links" aria-label="Main navigation">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Dashboard
              </NavLink>

              <div className="nav-user-group">
                <div className="nav-user-badge" title={user?.email || ""}>
                  <span className="nav-user-avatar">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </span>
                  <span>{user?.name || "User"}</span>
                </div>

                <button
                  type="button"
                  className="nav-logout"
                  onClick={handleLogout}
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Sign In
              </NavLink>

              <button
                type="button"
                className="button button-primary nav-register"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}