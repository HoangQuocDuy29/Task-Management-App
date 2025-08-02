// src/services/logworkService.ts
import { api } from '../utils/api';
import type { Logwork, CreateLogworkRequest, UpdateLogworkRequest, PaginatedResponse } from '../types';

export class LogworkService {
  async getLogwork(params?: any): Promise<PaginatedResponse<Logwork>> {
    try {
      const response = await api.get('/logwork', params);
      return {
        data: response.data.data || [],
        total: response.data.data?.length || 0,
        page: 1,
        limit: 50,
        totalPages: 1
      };
    } catch (error: any) {
      console.error('Error fetching logwork:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch logwork');
    }
  }

  async getLogworkById(id: number): Promise<Logwork> {
    try {
      const response = await api.get(`/logwork/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch logwork');
    }
  }

  async createLogwork(logworkData: CreateLogworkRequest): Promise<Logwork> {
    try {
      const response = await api.post('/logwork', logworkData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create logwork');
    }
  }

  async updateLogwork(id: number, logworkData: UpdateLogworkRequest): Promise<Logwork> {
    try {
      const response = await api.put(`/logwork/${id}`, logworkData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update logwork');
    }
  }

  async deleteLogwork(id: number): Promise<void> {
    try {
      await api.delete(`/logwork/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete logwork');
    }
  }
}

export const logworkService = new LogworkService();
