import { EntityManager } from '@mikro-orm/core';
import { Project } from '../entities/Project.entity';
import { User } from '../entities/User.entity';

export class ProjectService {
  constructor(private em: EntityManager) {}

  async getAllProjects(): Promise<Project[]> {
    return this.em.find(Project, {}, { 
      populate: ['createdBy', 'assignedUsers', 'tasks'] 
    });
  }

  async getProjectById(id: number): Promise<Project | null> {
    return this.em.findOne(Project, { id }, { 
      populate: ['createdBy', 'assignedUsers', 'tasks'] 
    });
  }

  async createProject(projectData: {
    name: string;
    description?: string;
    createdById: number;
    assignedUserIds?: number[];
  }): Promise<Project> {
    const createdByUser = await this.em.findOne(User, { id: projectData.createdById });
    if (!createdByUser) {
      throw new Error('Creator user not found');
    }

    const project = this.em.create(Project, {
      name: projectData.name,
      description: projectData.description,
      createdBy: createdByUser,
    }as any);

    if (projectData.assignedUserIds && projectData.assignedUserIds.length > 0) {
      const assignedUsers = await this.em.find(User, { 
        id: { $in: projectData.assignedUserIds } 
      });
      project.assignedUsers.set(assignedUsers);
    }

    await this.em.persistAndFlush(project);
    return project;
  }

  async updateProject(id: number, updateData: {
    name?: string;
    description?: string;
    assignedUserIds?: number[];
  }): Promise<Project> {
    const project = await this.em.findOne(Project, { id }, { 
      populate: ['assignedUsers'] 
    });
    if (!project) {
      throw new Error('Project not found');
    }

    if (updateData.name) project.name = updateData.name;
    if (updateData.description !== undefined) project.description = updateData.description;

    if (updateData.assignedUserIds) {
      const assignedUsers = await this.em.find(User, { 
        id: { $in: updateData.assignedUserIds } 
      });
      project.assignedUsers.set(assignedUsers);
    }

    await this.em.persistAndFlush(project);
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    const project = await this.em.findOne(Project, { id });
    if (!project) {
      throw new Error('Project not found');
    }

    await this.em.removeAndFlush(project);
  }

  async assignUserToProject(projectId: number, userId: number): Promise<Project> {
    const project = await this.em.findOne(Project, { id: projectId }, { 
      populate: ['assignedUsers'] 
    });
    if (!project) {
      throw new Error('Project not found');
    }

    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    project.assignedUsers.add(user);
    await this.em.persistAndFlush(project);
    return project;
  }
}