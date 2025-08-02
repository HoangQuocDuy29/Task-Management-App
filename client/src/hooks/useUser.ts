// ============================================
// 📁 FILE: client/src/hooks/useUser.ts
// 🎯 PURPOSE: Simple user data management hook - CODE NGẮN
// ✏️ ACTION: CẬP NHẬT - Giữ version ngắn gọn hiện tại
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest
} from '../types';

interface UseUserReturn {
  users: User[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  createUser: (data: CreateUserRequest) => Promise<User | null>;
  updateUser: (id: number, data: UpdateUserRequest) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
  changeUserRole: (id: number, role: string) => Promise<User | null>;
  clearError: () => void;
}

export const useUser = (): UseUserReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: CreateUserRequest): Promise<User | null> => {
    try {
      setCreating(true);
      setError(null);
      const newUser = await userService.createUser(data);
      await fetchUsers(); // Refresh list
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      return null;
    } finally {
      setCreating(false);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, data: UpdateUserRequest): Promise<User | null> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedUser = await userService.updateUser(id, data);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const changeUserRole = useCallback(async (id: number, role: string): Promise<User | null> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedUser = await userService.changeUserRole(id, role);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change user role');
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    creating,
    updating,
    deleting,
    error,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
    clearError,
  };
};

export default useUser;
