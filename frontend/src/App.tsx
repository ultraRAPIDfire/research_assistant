import Navbar from "./components/Navbar";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import SourcePage from "./pages/SourcePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

import "./App.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="empty-state"
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div className="loading-spinner" />
        <p style={{ color: "var(--ink-muted, #656d76)" }}>
          Checking session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function ProjectRoute() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <ProjectPage
      projectId={Number(id)}
      onOpenSource={(sourceId) => navigate(`/sources/${sourceId}`)}
    />
  );
}

function SourceRoute() {
  const { id } = useParams<{ id: string }>();

  return <SourcePage sourceId={Number(id)} />;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="app-main">
        <Routes>
          {/* Root redirect */}
          <Route
            path="/"
            element={
              loading ? null : (
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  replace
                />
              )
            }
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <Login />
              </PublicAuthRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicAuthRoute>
                <Register />
              </PublicAuthRoute>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  onOpenProject={(id) => navigate(`/projects/${id}`)}
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
                to={isAuthenticated ? "/dashboard" : "/login"}
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
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}