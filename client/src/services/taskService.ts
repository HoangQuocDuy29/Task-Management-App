// src/services/taskService.ts
import { api } from '../utils/api';
import type { Task, CreateTaskRequest, UpdateTaskRequest, PaginatedResponse } from '../types';

export class TaskService {
  async getTasks(params?: any): Promise<PaginatedResponse<Task>> {
    try {
      const response = await api.get('/tasks', params);
      return {
        data: response.data.data || [],
        total: response.data.data?.length || 0,
        page: 1,
        limit: 50,
        totalPages: 1
      };
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch task');
    }
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  }

  async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update task');
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete task');
    }
  }

  async getUserTasks(userId: number): Promise<Task[]> {
    try {
      const response = await api.get(`/tasks/user/${userId}`);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user tasks');
    }
  }
}

export const taskService = new TaskService();
