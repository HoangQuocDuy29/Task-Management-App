// server/src/services/TicketService.ts
import { EntityManager } from '@mikro-orm/core';
import { Ticket, TicketStatus } from '../entities/Ticket.entity'; // ✅ Remove TicketType
import { Task } from '../entities/Task.entity';
import { User } from '../entities/User.entity'; // ✅ Fix import path

export class TicketService {
  constructor(private em: EntityManager) {}

  async getAllTickets(): Promise<Ticket[]> {
    return this.em.find(Ticket, {}, { 
      populate: ['task', 'requestBy', 'approvedBy'] // ✅ Fix references
    });
  }

  async getTicketById(id: number): Promise<Ticket | null> {
    return this.em.findOne(Ticket, { id }, { 
      populate: ['task', 'requestBy', 'approvedBy'] // ✅ Fix references
    });
  }

  async createTicket(ticketData: {
    title: string;
    description?: string;
    priority?: string;
    taskId: number;
    requestById: number; // ✅ This will map to requested_by_id
    notes?: string;
  }): Promise<Ticket> {
    const task = await this.em.findOne(Task, { id: ticketData.taskId });
    if (!task) {
      throw new Error('Task not found');
    }

    const requestByUser = await this.em.findOne(User, { id: ticketData.requestById });
    if (!requestByUser) {
      throw new Error('Request user not found');
    }

    const ticket = this.em.create(Ticket, {
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      task,
      requestBy: requestByUser, // ✅ Updated reference
      notes: ticketData.notes,
      requestedAt: new Date(), // ✅ Set requested time
    } as any);

    await this.em.persistAndFlush(ticket);
    return ticket;
  }

  async updateTicket(id: number, updateData: {
    title?: string;
    description?: string;
    status?: TicketStatus;
    priority?: string;
    taskId?: number;
    notes?: string;
    approvedById?: number;
  }): Promise<Ticket> {
    const ticket = await this.em.findOne(Ticket, { id });
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (updateData.taskId) {
      const task = await this.em.findOne(Task, { id: updateData.taskId });
      if (!task) {
        throw new Error('Task not found');
      }
      ticket.task = task;
    }

    if (updateData.approvedById) {
      const approvedBy = await this.em.findOne(User, { id: updateData.approvedById });
      if (!approvedBy) {
        throw new Error('Approved user not found');
      }
      ticket.approvedBy = approvedBy;
      ticket.approvedAt = new Date();
    }

    // ✅ Remove the 'type' reference - không có trong new schema
    Object.assign(ticket, {
      title: updateData.title ?? ticket.title,
      description: updateData.description ?? ticket.description,
      status: updateData.status ?? ticket.status,
      priority: updateData.priority ?? ticket.priority,
      notes: updateData.notes ?? ticket.notes,
    });

    await this.em.persistAndFlush(ticket);
    return ticket;
  }

  async deleteTicket(id: number): Promise<void> {
    const ticket = await this.em.findOne(Ticket, { id });
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    await this.em.removeAndFlush(ticket);
  }
}


