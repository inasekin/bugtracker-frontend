import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export type IssueCategoryDto = {
  categoryName: string;
  userId?: string;
};

export type UserRoleDictionary = {
  [Key: string]: string;
};

export type ProjectDto = {
  id: string;
  name: string;
  description: string;
  userRoles: UserRoleDictionary;
  versions: string[];
  issueCategories: IssueCategoryDto[];
};

export const defaultProjectDto: ProjectDto = {
  id: "",
  name: "",
  description: "",
  versions: [],
  issueCategories: [],
  userRoles: {}
};

export function useProjects() {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/project`, {
          method: "GET",
          credentials: "include",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении проектов');
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при получении проектов');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

export function useProject(projectId?: string) {
  const [project, setProject] = useState<ProjectDto>(defaultProjectDto);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/project/${projectId}`, {
          method: "GET",
          credentials: "include",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении проекта');
        }

        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при получении проекта');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const updateProject = async (updatedProject: ProjectDto) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/project${projectId ? `/${projectId}` : ''}`, {
        method: projectId ? "PUT" : "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: "include",
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении проекта');
      }

      const data = await response.json();
      setProject(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при обновлении проекта';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async () => {
    if (!projectId) {
      return { success: false, error: 'ID проекта не указан' };
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/project/${projectId}`, {
        method: "DELETE",
        credentials: "include",
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении проекта');
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении проекта';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    project,
    setProject,
    loading,
    error,
    updateProject,
    deleteProject
  };
}
