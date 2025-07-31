import { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { AuthService } from '../services/AuthService';
import { sendSuccess, sendError } from '../utils/response.utils';

export class AuthController {
  static async login(req: Request, res: Response) {
  try {
    console.log('=== DEBUG LOGIN ===');
    const em = RequestContext.getEntityManager();
    console.log('EntityManager exists:', !!em);
    console.log('EntityManager type:', typeof em);
    
    if (!em) {
      return sendError(res, 'Database connection not available', undefined, 500);
    }
    
    const authService = new AuthService(em);
    const result = await authService.login(req.body);
    return sendSuccess(res, 'Login successful', result);
  } catch (error: any) {
    console.error('Login error:', error);
    return sendError(res, 'Login failed', error.message, 401);
  }
}

  static async register(req: Request, res: Response) {
    try {
      const em = RequestContext.getEntityManager();
      if (!em) {
        return sendError(res, 'Database connection not available', undefined, 500);
      }
      
      const authService = new AuthService(em);
      const user = await authService.register(req.body);
      const { password, ...userWithoutPassword } = user;
      
      return sendSuccess(res, 'User registered successfully', userWithoutPassword, 201);
    } catch (error: any) {
      return sendError(res, 'Registration failed', error.message, 400);
    }
  }
}