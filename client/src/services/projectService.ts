// src/services/projectService.ts
import { api } from '../utils/api';
import type { Project, CreateProjectRequest, UpdateProjectRequest, PaginatedResponse } from '../types';

export class ProjectService {
  async getProjects(params?: any): Promise<PaginatedResponse<Project>> {
  try {
    const response = await api.get('/projects', params);
    return {
      data: response.data.data || [],
      total: response.data.data?.length || 0,
      page: 1,
      limit: 50,
      totalPages: 1
    };
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    
    // ✅ Handle authentication errors
    if (error.response?.status === 401) {
      throw new Error('Please login to access projects');
    }
    if (error.response?.status === 403) {
      throw new Error('Admin access required to view projects');
    }
    
    throw new Error(error.response?.data?.error || 'Failed to fetch projects');
  }
}

  async getProjectById(id: number): Promise<Project> {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch project');
    }
  }

  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    try {
      const response = await api.post('/projects', projectData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create project');
    }
  }

  async updateProject(id: number, projectData: UpdateProjectRequest): Promise<Project> {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update project');
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete project');
    }
  }

  async assignUserToProject(projectId: number, userId: number): Promise<Project> {
    try {
      const response = await api.post(`/projects/${projectId}/assign-user`, { userId });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to assign user to project');
    }
  }
}

export const projectService = new ProjectService();
