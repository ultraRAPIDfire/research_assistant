import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import SourcePage from "./pages/SourcePage";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function isAuthenticated() {
  return localStorage.getItem("research_auth") === "true";
}

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const authenticated = isAuthenticated();

  if (!authenticated) {
    return null;
  }

  function logout() {
    localStorage.removeItem("research_auth");
    navigate("/login", { replace: true });
  }

  const projectsActive =
    location.pathname === "/" ||
    location.pathname.startsWith("/projects");

  return (
    <header className="app-nav">
      <div className="nav-inner">

        <button
          className="brand"
          onClick={() => navigate("/")}
        >
          <span className="brand-icon">
            🔬
          </span>

          <span>
            <strong>ResearchAI</strong>
            <small>Research Assistant</small>
          </span>
        </button>

        <nav className="nav-links">
          <button
            className={
              location.pathname === "/"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => navigate("/")}
          >
            <span>⌂</span>
            Home
          </button>

          <button
            className={
              projectsActive
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => navigate("/")}
          >
            <span>📚</span>
            Projects
          </button>
        </nav>

        <div className="nav-actions">
          <div className="nav-user">
            <div className="avatar">
              R
            </div>

            <div className="nav-user-info">
              <strong>Researcher</strong>
              <span>Workspace</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Sign out
          </button>
        </div>

      </div>
    </header>
  );
}

function ProjectRoute() {
  const navigate = useNavigate();

  const id = Number(
    window.location.pathname.split("/")[2]
  );

  return (
    <ProjectPage
      projectId={id}
      onOpenSource={(sourceId) =>
        navigate(`/sources/${sourceId}`)
      }
    />
  );
}

function SourceRoute() {
  const id = Number(
    window.location.pathname.split("/")[2]
  );

  return <SourcePage sourceId={id} />;
}

function AppRoutes() {
  return (
    <>
      <Navigation />

      <main className="app-main">
        <Routes>

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard
                  onOpenProject={(id) =>
                    window.location.href =
                      `/projects/${id}`
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* Projects */}
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectRoute />
              </ProtectedRoute>
            }
          />

          {/* Sources */}
          <Route
            path="/sources/:id"
            element={
              <ProtectedRoute>
                <SourceRoute />
              </ProtectedRoute>
            }
          />

          {/* Unknown route */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  isAuthenticated()
                    ? "/"
                    : "/login"
                }
                replace
              />
            }
          />

        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}