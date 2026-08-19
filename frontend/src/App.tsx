import Navbar from "./components/Navbar";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function ProjectRoute() {
  const navigate = useNavigate();

  const id = Number(window.location.pathname.split("/")[2]);

  return (
    <ProjectPage
      projectId={id}
      onOpenSource={(sourceId) => navigate(`/sources/${sourceId}`)}
    />
  );
}

function SourceRoute() {
  const id = Number(window.location.pathname.split("/")[2]);

  return <SourcePage sourceId={id} />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />

      <main className="app-main">
        <Routes>
          {/* Root — never shows the dashboard directly.
              Signed-in users go to /dashboard, everyone
              else lands on /login. */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated() ? "/dashboard" : "/login"}
                replace
              />
            }
          />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  onOpenProject={(id) =>
                    (window.location.href = `/projects/${id}`)
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
                to={isAuthenticated() ? "/dashboard" : "/login"}
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