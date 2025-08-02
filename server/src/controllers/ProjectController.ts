// server/src/controllers/ProjectController.ts
import { Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { ProjectService } from '../services/ProjectService';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response.utils';

export class ProjectController {
  static async getAllProjects(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const projectService = new ProjectService(em);
      
      const projects = await projectService.getAllProjects();
      return sendSuccess(res, 'Projects retrieved successfully', projects);
    } catch (error: any) {
      return sendError(res, 'Failed to get projects', error.message);
    }
  }

  static async getProjectById(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const projectService = new ProjectService(em);
      const id = parseInt(req.params.id);
      
      const project = await projectService.getProjectById(id);
      if (!project) {
        return sendError(res, 'Project not found', undefined, 404);
      }
      
      return sendSuccess(res, 'Project retrieved successfully', project);
    } catch (error: any) {
      return sendError(res, 'Failed to get project', error.message);
    }
  }

  static async createProject(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const projectService = new ProjectService(em);
      
      const projectData = {
        ...req.body,
        createdById: req.user!.userId,
      };
      
      const project = await projectService.createProject(projectData);
      return sendSuccess(res, 'Project created successfully', project, 201);
    } catch (error: any) {
      return sendError(res, 'Failed to create project', error.message);
    }
  }

  static async updateProject(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const projectService = new ProjectService(em);
      const id = parseInt(req.params.id);
      
      const project = await projectService.updateProject(id, req.body);
      return sendSuccess(res, 'Project updated successfully', project);
    } catch (error: any) {
      return sendError(res, 'Failed to update project', error.message);
    }
  }

  static async deleteProject(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const projectService = new ProjectService(em);
      const id = parseInt(req.params.id);
      
      await projectService.deleteProject(id);
      return sendSuccess(res, 'Project deleted successfully');
    } catch (error: any) {
      return sendError(res, 'Failed to delete project', error.message);
    }
  }

  static async assignUserToProject(req: AuthRequest, res: Response) {
    try {
      const em = RequestContext.getEntityManager()!;
      const projectService = new ProjectService(em);
      const projectId = parseInt(req.params.id);
      const { userId } = req.body;
      
      const project = await projectService.assignUserToProject(projectId, userId);
      return sendSuccess(res, 'User assigned to project successfully', project);
    } catch (error: any) {
      return sendError(res, 'Failed to assign user to project', error.message);
    }
  }
}