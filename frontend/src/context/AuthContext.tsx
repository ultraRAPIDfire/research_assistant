import { useEffect, useState, type ReactNode } from "react";
import {
  api,
  getStoredToken,
  getStoredUser,
  clearStoredSession,
  type User,
} from "../services/api";
import { AuthContext } from "./authContextDef";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState<boolean>(true);

  async function checkSession() {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getCurrentUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        clearStoredSession();
        setUser(null);
      }
    } catch (err) {
      console.warn("Session check failed, clearing auth session:", err);
      clearStoredSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  async function login(data: { email: string; password: string }) {
    const response = await api.login(data);
    if (response.user) {
      setUser(response.user);
    }
  }

  async function register(data: { name: string; email: string; password: string }) {
    const response = await api.register(data);
    if (response.user) {
      setUser(response.user);
    }
  }

  async function logout() {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  }

  async function refreshUser() {
    await checkSession();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
