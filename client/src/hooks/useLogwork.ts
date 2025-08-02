// ============================================
// 📁 FILE: client/src/hooks/useLogwork.ts
// 🎯 PURPOSE: Simple logwork data management hook - CODE NGẮN
// ✏️ ACTION: CẬP NHẬT - Giữ version ngắn gọn hiện tại
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { logworkService } from '../services/logworkService';
import type { 
  Logwork, 
  CreateLogworkRequest, 
  UpdateLogworkRequest
} from '../types';

interface UseLogworkReturn {
  logwork: Logwork[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  createLogwork: (data: CreateLogworkRequest) => Promise<Logwork | null>;
  updateLogwork: (id: number, data: UpdateLogworkRequest) => Promise<Logwork | null>;
  deleteLogwork: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useLogwork = (): UseLogworkReturn => {
  const [logwork, setLogwork] = useState<Logwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchLogwork = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await logworkService.getLogwork();
      setLogwork(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logwork');
    } finally {
      setLoading(false);
    }
  }, []);

  const createLogwork = useCallback(async (data: CreateLogworkRequest): Promise<Logwork | null> => {
    try {
      setCreating(true);
      setError(null);
      const newLogwork = await logworkService.createLogwork(data);
      await fetchLogwork(); // Refresh list
      return newLogwork;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create logwork');
      return null;
    } finally {
      setCreating(false);
    }
  }, [fetchLogwork]);

  const updateLogwork = useCallback(async (id: number, data: UpdateLogworkRequest): Promise<Logwork | null> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedLogwork = await logworkService.updateLogwork(id, data);
      setLogwork(prev => prev.map(entry => entry.id === id ? updatedLogwork : entry));
      return updatedLogwork;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update logwork');
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteLogwork = useCallback(async (id: number): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      await logworkService.deleteLogwork(id);
      setLogwork(prev => prev.filter(entry => entry.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete logwork');
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  useEffect(() => {
    fetchLogwork();
  }, [fetchLogwork]);

  return {
    logwork,
    loading,
    creating,
    updating,
    deleting,
    error,
    createLogwork,
    updateLogwork,
    deleteLogwork,
    clearError,
  };
};

export default useLogwork;