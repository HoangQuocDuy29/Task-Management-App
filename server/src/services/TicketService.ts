import { EntityManager } from '@mikro-orm/core';
import { Ticket, TicketType, TicketStatus } from '../entities/Ticket.entity';
import { Task } from '../entities/Task.entity';
import { User } from '../entities/User.entity';

export class TicketService {
  constructor(private em: EntityManager) {}

  async getAllTickets(): Promise<Ticket[]> {
    return this.em.find(Ticket, {}, { 
      populate: ['task', 'createdBy'] 
    });
  }

  async getTicketById(id: number): Promise<Ticket | null> {
    return this.em.findOne(Ticket, { id }, { 
      populate: ['task', 'createdBy'] 
    });
  }

  async createTicket(ticketData: {
    title: string;
    description?: string;
    type: TicketType;
    taskId: number;
    createdById: number;
  }): Promise<Ticket> {
    const task = await this.em.findOne(Task, { id: ticketData.taskId });
    if (!task) {
      throw new Error('Task not found');
    }

    const createdByUser = await this.em.findOne(User, { id: ticketData.createdById });
    if (!createdByUser) {
      throw new Error('Creator user not found');
    }

    const ticket = this.em.create(Ticket, {
      title: ticketData.title,
      description: ticketData.description,
      type: ticketData.type,
      task,
      createdBy: createdByUser,
    }as any);

    await this.em.persistAndFlush(ticket);
    return ticket;
  }

  async updateTicket(id: number, updateData: {
    title?: string;
    description?: string;
    type?: TicketType;
    status?: TicketStatus;
    taskId?: number;
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

    Object.assign(ticket, {
      title: updateData.title ?? ticket.title,
      description: updateData.description ?? ticket.description,
      type: updateData.type ?? ticket.type,
      status: updateData.status ?? ticket.status,
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