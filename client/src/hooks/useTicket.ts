// ============================================
// 📁 FILE: client/src/hooks/useTicket.ts
// 🎯 PURPOSE: Simple ticket data management hook - CODE NGẮN
// ✏️ ACTION: CẬP NHẬT - Giữ version ngắn gọn hiện tại
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../services/ticketService';
import type { 
  Ticket, 
  CreateTicketRequest, 
  UpdateTicketRequest
} from '../types';

interface UseTicketReturn {
  tickets: Ticket[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  createTicket: (data: CreateTicketRequest) => Promise<Ticket | null>;
  updateTicket: (id: number, data: UpdateTicketRequest) => Promise<Ticket | null>;
  deleteTicket: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useTicket = (): UseTicketReturn => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ticketService.getTickets();
      setTickets(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTicket = useCallback(async (data: CreateTicketRequest): Promise<Ticket | null> => {
    try {
      setCreating(true);
      setError(null);
      const newTicket = await ticketService.createTicket(data);
      await fetchTickets(); // Refresh list
      return newTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
      return null;
    } finally {
      setCreating(false);
    }
  }, [fetchTickets]);

  const updateTicket = useCallback(async (id: number, data: UpdateTicketRequest): Promise<Ticket | null> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedTicket = await ticketService.updateTicket(id, data);
      setTickets(prev => prev.map(ticket => ticket.id === id ? updatedTicket : ticket));
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deleteTicket = useCallback(async (id: number): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      await ticketService.deleteTicket(id);
      setTickets(prev => prev.filter(ticket => ticket.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ticket');
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    creating,
    updating,
    deleting,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    clearError,
  };
};

export default useTicket;
