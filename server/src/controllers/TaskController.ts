// server/src/controllers/ProjectController.ts
import { Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { TaskService } from '../services/TaskService';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response.utils';

export class TaskController {
  static async getAllTasks(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const taskService = new TaskService(em);
      
      // Admin gets all tasks, User gets only their assigned tasks
      let tasks;
      if (req.user?.role === 'admin') {
        tasks = await taskService.getAllTasks();
      } else {
        tasks = await taskService.getTasksByUser(req.user!.userId);
      }
      
      return sendSuccess(res, 'Tasks retrieved successfully', tasks);
    } catch (error: any) {
      return sendError(res, 'Failed to get tasks', error.message);
    }
  }

  static async getTaskById(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const taskService = new TaskService(em);
      const id = parseInt(req.params.id);
      
      const task = await taskService.getTaskById(id);
      if (!task) {
        return sendError(res, 'Task not found', undefined, 404);
      }

      // Users can only view their assigned tasks
      if (req.user?.role !== 'admin' && task.assignedTo.id !== req.user?.userId) {
        return sendError(res, 'Access denied', undefined, 403);
      }
      
      return sendSuccess(res, 'Task retrieved successfully', task);
    } catch (error: any) {
      return sendError(res, 'Failed to get task', error.message);
    }
  }

  static async createTask(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const taskService = new TaskService(em);
      
      const taskData = {
        ...req.body,
        createdById: req.user!.userId,
      };
      
      const task = await taskService.createTask(taskData);
      return sendSuccess(res, 'Task created successfully', task, 201);
    } catch (error: any) {
      return sendError(res, 'Failed to create task', error.message);
    }
  }

  static async updateTask(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const taskService = new TaskService(em);
      const id = parseInt(req.params.id);
      
      const task = await taskService.updateTask(id, req.body);
      return sendSuccess(res, 'Task updated successfully', task);
    } catch (error: any) {
      return sendError(res, 'Failed to update task', error.message);
    }
  }

  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const taskService = new TaskService(em);
      const id = parseInt(req.params.id);
      
      await taskService.deleteTask(id);
      return sendSuccess(res, 'Task deleted successfully');
    } catch (error: any) {
      return sendError(res, 'Failed to delete task', error.message);
    }
  }

  static async getUserTasks(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const taskService = new TaskService(em);
      
      // Users can only get their own tasks
      const userId = req.user?.role === 'admin' ? 
        parseInt(req.params.userId) : req.user!.userId;
      
      const tasks = await taskService.getTasksByUser(userId);
      return sendSuccess(res, 'User tasks retrieved successfully', tasks);
    } catch (error: any) {
      return sendError(res, 'Failed to get user tasks', error.message);
    }
  }
}