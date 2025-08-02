// server/src/controllers/ProjectController.ts
import { Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response.utils';

export class UserController {
  static async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const userService = new UserService(em);
      
      const users = await userService.getAllUsers();
      const usersWithoutPassword = users.map(({ password, ...user }) => user);
      
      return sendSuccess(res, 'Users retrieved successfully', usersWithoutPassword);
    } catch (error: any) {
      return sendError(res, 'Failed to get users', error.message);
    }
  }

  static async getUserById(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const userService = new UserService(em);
      const id = parseInt(req.params.id);
      
      const user = await userService.getUserById(id);
      if (!user) {
        return sendError(res, 'User not found', undefined, 404);
      }
      
      const { password, ...userWithoutPassword } = user;
      return sendSuccess(res, 'User retrieved successfully', userWithoutPassword);
    } catch (error: any) {
      return sendError(res, 'Failed to get user', error.message);
    }
  }

  static async createUser(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const userService = new UserService(em);
      
      const user = await userService.createUser(req.body);
      const { password, ...userWithoutPassword } = user;
      
      return sendSuccess(res, 'User created successfully', userWithoutPassword, 201);
    } catch (error: any) {
      return sendError(res, 'Failed to create user', error.message);
    }
  }

  static async updateUser(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const userService = new UserService(em);
      const id = parseInt(req.params.id);
      
      const user = await userService.updateUser(id, req.body);
      const { password, ...userWithoutPassword } = user;
      
      return sendSuccess(res, 'User updated successfully', userWithoutPassword);
    } catch (error: any) {
      return sendError(res, 'Failed to update user', error.message);
    }
  }

  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const userService = new UserService(em);
      const id = parseInt(req.params.id);
      
      await userService.deleteUser(id);
      return sendSuccess(res, 'User deleted successfully');
    } catch (error: any) {
      return sendError(res, 'Failed to delete user', error.message);
    }
  }

  static async changeUserRole(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const userService = new UserService(em);
      const id = parseInt(req.params.id);
      const { role } = req.body;
      
      const user = await userService.changeUserRole(id, role);
      const { password, ...userWithoutPassword } = user;
      
      return sendSuccess(res, 'User role updated successfully', userWithoutPassword);
    } catch (error: any) {
      return sendError(res, 'Failed to update user role', error.message);
    }
  }
}