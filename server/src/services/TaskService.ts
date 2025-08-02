// server/src/services/TaskService.ts
import { EntityManager } from '@mikro-orm/core';
import { Task, TaskStatus, TaskPriority } from '../entities/Task.entity';
import { User } from '../entities/User.entity';
import { Project } from '../entities/Project.entity';

export class TaskService {
  constructor(private em: EntityManager) {}

  async getAllTasks(): Promise<Task[]> {
    return this.em.find(Task, {}, { 
      populate: ['assignedTo', 'createdBy', 'project']  // ← Bỏ 'tickets' tạm thời
    });
  }

  async getTaskById(id: number): Promise<Task | null> {
    return this.em.findOne(Task, { id }, { 
      populate: ['assignedTo', 'createdBy', 'project']  // ← Bỏ 'tickets', 'logworks' tạm thời
    });
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return this.em.find(Task, { assignedTo: userId }, { 
      populate: ['assignedTo', 'createdBy', 'project'] 
    });
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    priority: TaskPriority;
    deadline?: Date;
    assignedToId: number;
    createdById: number;
    projectId?: number;
  }): Promise<Task> {
    const assignedUser = await this.em.findOne(User, { id: taskData.assignedToId });
    if (!assignedUser) {
      throw new Error('Assigned user not found');
    }

    const createdByUser = await this.em.findOne(User, { id: taskData.createdById });
    if (!createdByUser) {
      throw new Error('Creator user not found');
    }

    let project = null;
    if (taskData.projectId) {
      project = await this.em.findOne(Project, { id: taskData.projectId });
      if (!project) {
        throw new Error('Project not found');
      }
    }

    const task = this.em.create(Task, {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      deadline: taskData.deadline,
      assignedTo: assignedUser,
      createdBy: createdByUser,
      project,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await this.em.persistAndFlush(task);
    return task;
  }

  async updateTask(id: number, updateData: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    deadline?: Date;
    assignedToId?: number;
    projectId?: number;
  }): Promise<Task> {
    const task = await this.em.findOne(Task, { id });
    if (!task) {
      throw new Error('Task not found');
    }

    if (updateData.assignedToId) {
      const assignedUser = await this.em.findOne(User, { id: updateData.assignedToId });
      if (!assignedUser) {
        throw new Error('Assigned user not found');
      }
      task.assignedTo = assignedUser;
    }

    if (updateData.projectId) {
      const project = await this.em.findOne(Project, { id: updateData.projectId });
      if (!project) {
        throw new Error('Project not found');
      }
      task.project = project;
    }

    Object.assign(task, {
      title: updateData.title ?? task.title,
      description: updateData.description ?? task.description,
      status: updateData.status ?? task.status,
      priority: updateData.priority ?? task.priority,
      deadline: updateData.deadline ?? task.deadline,
    });

    await this.em.persistAndFlush(task);
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.em.findOne(Task, { id });
    if (!task) {
      throw new Error('Task not found');
    }

    await this.em.removeAndFlush(task);
  }
}