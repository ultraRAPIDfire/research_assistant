const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const TOKEN_KEY = "research_assistant_token";
const USER_KEY = "research_assistant_user";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem("research_auth", "true");
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("research_auth");
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers,
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
    }
    throw new Error(
      data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data as T;
}

/* =====================================================
   TYPES
===================================================== */

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface Project {
  id: number;
  title: string;
  research_question: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  source_count?: number;
}

export interface Source {
  id: number;
  project_id: number;
  title: string;
  author: string | null;
  url: string | null;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIResponse {
  sourceId?: number;
  projectId?: number;
  analysis: string;
}

export interface CreateProjectData {
  title: string;
  research_question?: string;
  description?: string;
}

export interface UpdateProjectData {
  title: string;
  research_question?: string;
  description?: string;
}

export interface CreateSourceData {
  title: string;
  author?: string;
  url?: string;
  content?: string;
}

export interface UpdateSourceData {
  title: string;
  author?: string;
  url?: string;
  content?: string;
}

export interface DeleteResponse {
  message: string;
}

/* =====================================================
   API
===================================================== */

export const api = {

  /* ===================================================
     AUTH
  =================================================== */

  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const res = await request<AuthResponse>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (res.user && res.token) {
      setStoredSession(res.token, res.user);
    }

    return res;
  },

  async login(data: {
    email: string;
    password: string;
  }) {
    const res = await request<AuthResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (res.user && res.token) {
      setStoredSession(res.token, res.user);
    }

    return res;
  },

  async logout() {
    try {
      return await request<DeleteResponse>(
        "/auth/logout",
        {
          method: "POST",
        }
      );
    } finally {
      clearStoredSession();
    }
  },

  getCurrentUser() {
    return request<AuthResponse>(
      "/auth/me"
    );
  },

  /* ===================================================
     PROJECTS
  =================================================== */

  getProjects() {
    return request<Project[]>(
      "/projects"
    );
  },

  getProject(id: number) {
    return request<Project>(
      `/projects/${id}`
    );
  },

  createProject(
    data: CreateProjectData
  ) {
    return request<Project>(
      "/projects",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  updateProject(
    id: number,
    data: UpdateProjectData
  ) {
    return request<Project>(
      `/projects/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteProject(id: number) {
    return request<DeleteResponse>(
      `/projects/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  /* ===================================================
     SOURCES
  =================================================== */

  getSources(
    projectId: number,
    search = ""
  ) {
    const query = encodeURIComponent(
      search.trim()
    );

    return request<Source[]>(
      `/sources/project/${projectId}?search=${query}`
    );
  },

  getSource(id: number) {
    return request<Source>(
      `/sources/${id}`
    );
  },

  createSource(
    projectId: number,
    data: CreateSourceData
  ) {
    return request<Source>(
      `/sources/project/${projectId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  updateSource(
    id: number,
    data: UpdateSourceData
  ) {
    return request<Source>(
      `/sources/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteSource(id: number) {
    return request<DeleteResponse>(
      `/sources/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  /* ===================================================
     AI
  =================================================== */

  analyzeSource(id: number) {
    return request<AIResponse>(
      "/ai/analyze-source",
      {
        method: "POST",
        body: JSON.stringify({
          sourceId: id,
        }),
      }
    );
  },

  analyzeProject(projectId: number) {
    return request<AIResponse>(
      "/ai/analyze-project",
      {
        method: "POST",
        body: JSON.stringify({
          projectId,
        }),
      }
    );
  },
};