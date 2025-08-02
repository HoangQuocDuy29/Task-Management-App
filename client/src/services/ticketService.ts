// src/services/ticketService.ts
import { api } from '../utils/api';
import type { Ticket, CreateTicketRequest, UpdateTicketRequest, PaginatedResponse } from '../types';

export class TicketService {
  async getTickets(params?: any): Promise<PaginatedResponse<Ticket>> {
    try {
      const response = await api.get('/tickets', params);
      return {
        data: response.data.data || [],
        total: response.data.data?.length || 0,
        page: 1,
        limit: 50,
        totalPages: 1
      };
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tickets');
    }
  }

  async getTicketById(id: number): Promise<Ticket> {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch ticket');
    }
  }

  async createTicket(ticketData: CreateTicketRequest): Promise<Ticket> {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create ticket');
    }
  }

  async updateTicket(id: number, ticketData: UpdateTicketRequest): Promise<Ticket> {
    try {
      const response = await api.put(`/tickets/${id}`, ticketData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update ticket');
    }
  }

  async deleteTicket(id: number): Promise<void> {
    try {
      await api.delete(`/tickets/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete ticket');
    }
  }
}

export const ticketService = new TicketService();

