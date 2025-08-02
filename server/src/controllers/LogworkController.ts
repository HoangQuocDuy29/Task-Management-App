// server/src/controllers/LogworkController.ts
import { Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { LogworkService } from '../services/LogworkService';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response.utils';

export class LogworkController {
  static async getAllLogwork(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const logworkService = new LogworkService(em);
      
      // Admin sees all logwork, User sees only their own
      let logworks;
      if (req.user?.role === 'admin') {
        logworks = await logworkService.getAllLogwork();
      } else {
        logworks = await logworkService.getLogworkByUser(req.user!.userId);
      }
      
      return sendSuccess(res, 'Logwork retrieved successfully', logworks);
    } catch (error: any) {
      return sendError(res, 'Failed to get logwork', error.message);
    }
  }

  static async getLogworkById(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const logworkService = new LogworkService(em);
      const id = parseInt(req.params.id);
      
      const logwork = await logworkService.getLogworkById(id);
      if (!logwork) {
        return sendError(res, 'Logwork not found', undefined, 404);
      }

      // Users can only view their own logwork
      if (req.user?.role !== 'admin' && logwork.user.id !== req.user?.userId) {
        return sendError(res, 'Access denied', undefined, 403);
      }
      
      return sendSuccess(res, 'Logwork retrieved successfully', logwork);
    } catch (error: any) {
      return sendError(res, 'Failed to get logwork', error.message);
    }
  }

  static async createLogwork(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const logworkService = new LogworkService(em);
      
      const logworkData = {
        ...req.body,
        userId: req.user!.userId,
      };
      
      const logwork = await logworkService.createLogwork(logworkData);
      return sendSuccess(res, 'Logwork created successfully', logwork, 201);
    } catch (error: any) {
      return sendError(res, 'Failed to create logwork', error.message);
    }
  }

  static async updateLogwork(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const logworkService = new LogworkService(em);
      const id = parseInt(req.params.id);
      
      const logwork = await logworkService.updateLogwork(id, req.body, req.user!.userId, req.user!.role);
      return sendSuccess(res, 'Logwork updated successfully', logwork);
    } catch (error: any) {
      return sendError(res, 'Failed to update logwork', error.message);
    }
  }

  static async deleteLogwork(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const logworkService = new LogworkService(em);
      const id = parseInt(req.params.id);
      
      await logworkService.deleteLogwork(id, req.user!.userId, req.user!.role);
      return sendSuccess(res, 'Logwork deleted successfully');
    } catch (error: any) {
      return sendError(res, 'Failed to delete logwork', error.message);
    }
  }
}