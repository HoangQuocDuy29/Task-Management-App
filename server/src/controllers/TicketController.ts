// server/src/controllers/ProjectController.ts
import { Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { TicketService } from '../services/TicketService';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response.utils';

export class TicketController {
  static async getAllTickets(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const ticketService = new TicketService(em);
      
      const tickets = await ticketService.getAllTickets();
      return sendSuccess(res, 'Tickets retrieved successfully', tickets);
    } catch (error: any) {
      return sendError(res, 'Failed to get tickets', error.message);
    }
  }

  static async getTicketById(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const ticketService = new TicketService(em);
      const id = parseInt(req.params.id);
      
      const ticket = await ticketService.getTicketById(id);
      if (!ticket) {
        return sendError(res, 'Ticket not found', undefined, 404);
      }
      
      return sendSuccess(res, 'Ticket retrieved successfully', ticket);
    } catch (error: any) {
      return sendError(res, 'Failed to get ticket', error.message);
    }
  }

  static async createTicket(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const ticketService = new TicketService(em);
      
      const ticketData = {
        ...req.body,
        createdById: req.user!.userId,
      };
      
      const ticket = await ticketService.createTicket(ticketData);
      return sendSuccess(res, 'Ticket created successfully', ticket, 201);
    } catch (error: any) {
      return sendError(res, 'Failed to create ticket', error.message);
    }
  }

  static async updateTicket(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const ticketService = new TicketService(em);
      const id = parseInt(req.params.id);
      
      const ticket = await ticketService.updateTicket(id, req.body);
      return sendSuccess(res, 'Ticket updated successfully', ticket);
    } catch (error: any) {
      return sendError(res, 'Failed to update ticket', error.message);
    }
  }

  static async deleteTicket(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const ticketService = new TicketService(em);
      const id = parseInt(req.params.id);
      
      await ticketService.deleteTicket(id);
      return sendSuccess(res, 'Ticket deleted successfully');
    } catch (error: any) {
      return sendError(res, 'Failed to delete ticket', error.message);
    }
  }
}