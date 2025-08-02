// src/services/userService.ts
import { api } from '../utils/api';
import type { User, CreateUserRequest, UpdateUserRequest, PaginatedResponse } from '../types';

export class UserService {
  async getUsers(params?: any): Promise<PaginatedResponse<User>> {
    try {
      const response = await api.get('/users', params);
      return {
        data: response.data.data || [],
        total: response.data.data?.length || 0,
        page: 1,
        limit: 50,
        totalPages: 1
      };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user');
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await api.post('/users', userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create user');
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  }

  async changeUserRole(id: number, role: string): Promise<User> {
    try {
      const response = await api.patch(`/users/${id}/role`, { role });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change user role');
    }
  }
}

export const userService = new UserService();
