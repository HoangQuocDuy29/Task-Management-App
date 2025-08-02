// ============================================
// 📁 FILE: client/src/hooks/useProject.ts
// 🎯 PURPOSE: Simple project data management hook - CODE NGẮN
// ✏️ ACTION: CẬP NHẬT - Giữ version ngắn gọn hiện tại
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import type { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest
} from '../types';

interface UseProjectReturn {
  projects: Project[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  createProject: (data: CreateProjectRequest) => Promise<Project | null>;
  updateProject: (id: number, data: UpdateProjectRequest) => Promise<Project | null>;
  deleteProject: (id: number) => Promise<boolean>;
  assignUserToProject: (projectId: number, userId: number) => Promise<Project | null>;
  clearError: () => void;
}

export const useProject = (): UseProjectReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getProjects();
      setProjects(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: CreateProjectRequest): Promise<Project | null> => {
    try {
      setCreating(true);
      setError(null);
      const newProject = await projectService.createProject(data);
      await fetchProjects(); // Refresh list
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      return null;
    } finally {
      setCreating(false);
    }
  }, [fetchProjects]);

  const updateProject = useCallback(async (id: number, data: UpdateProjectRequest): Promise<Project | null> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedProject = await projectService.updateProject(id, data);
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project));
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const assignUserToProject = useCallback(async (projectId: number, userId: number): Promise<Project | null> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedProject = await projectService.assignUserToProject(projectId, userId);
      setProjects(prev => prev.map(project => project.id === projectId ? updatedProject : project));
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign user to project');
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    creating,
    updating,
    deleting,
    error,
    createProject,
    updateProject,
    deleteProject,
    assignUserToProject,
    clearError,
  };
};

export default useProject;
