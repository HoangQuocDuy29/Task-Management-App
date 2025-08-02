// ============================================
// 📁 FILE: client/src/hooks/useTask.ts
// 🎯 PURPOSE: Simple task data management hook - CODE NGẮN
// ✏️ ACTION: CẬP NHẬT - Giữ version ngắn gọn hiện tại
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import type { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest
} from '../types';

interface UseTaskReturn {
  tasks: Task[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  createTask: (data: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (id: number, data: UpdateTaskRequest) => Promise<Task | null>;
  deleteTask: (id: number) => Promise<boolean>;
  getUserTasks: (userId: number) => Promise<Task[]>;
  clearError: () => void;
}

export const useTask = (): UseTaskReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskRequest): Promise<Task | null> => {
    try {
      setCreating(true);
      setError(null);
      const newTask = await taskService.createTask(data);
      await fetchTasks(); // Refresh list
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      return null;
    } finally {
      setCreating(false);
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: number, data: UpdateTaskRequest): Promise<Task | null> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedTask = await taskService.updateTask(id, data);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const getUserTasks = useCallback(async (userId: number): Promise<Task[]> => {
    try {
      setLoading(true);
      setError(null);
      const userTasks = await taskService.getUserTasks(userId);
      return userTasks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user tasks');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    creating,
    updating,
    deleting,
    error,
    createTask,
    updateTask,
    deleteTask,
    getUserTasks,
    clearError,
  };
};

export default useTask;
