// ============================================
// 📁 FILE: client/src/hooks/usePagination.ts
// 🎯 PURPOSE: Simple pagination logic hook - CODE NGẮN
// 🆕 ACTION: TẠO MỚI trong client/src/hooks/
// ============================================

import { useState, useCallback } from 'react';

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPage: () => void;
}

export const usePagination = (initialPageSize: number = 10): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset to first page
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    pageSize,
    goToPage,
    setPageSize,
    resetPage,
  };
};

export default usePagination;