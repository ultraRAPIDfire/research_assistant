const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
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