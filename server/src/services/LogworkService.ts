import { EntityManager } from '@mikro-orm/core';
import { Logwork } from '../entities/Logwork.entity';
import { User } from '../entities/User.entity';
import { Task } from '../entities/Task.entity';

export class LogworkService {
  constructor(private em: EntityManager) {}

  async getAllLogwork(): Promise<Logwork[]> {
    return this.em.find(Logwork, {}, { 
      populate: ['user', 'task'] 
    });
  }

  async getLogworkById(id: number): Promise<Logwork | null> {
    return this.em.findOne(Logwork, { id }, { 
      populate: ['user', 'task'] 
    });
  }

  async getLogworkByUser(userId: number): Promise<Logwork[]> {
    return this.em.find(Logwork, { user: userId }, { 
      populate: ['user', 'task'] 
    });
  }

  async createLogwork(logworkData: {
    description: string;
    hoursWorked: number;
    workDate: Date;
    userId: number;
    taskId: number;
  }): Promise<Logwork> {
    const user = await this.em.findOne(User, { id: logworkData.userId });
    if (!user) {
      throw new Error('User not found');
    }

    const task = await this.em.findOne(Task, { id: logworkData.taskId });
    if (!task) {
      throw new Error('Task not found');
    }

    // Validate that user is assigned to the task
    if (task.assignedTo.id !== logworkData.userId) {
      throw new Error('User is not assigned to this task');
    }

    const logwork = this.em.create(Logwork, {
      description: logworkData.description,
      hoursWorked: logworkData.hoursWorked,
      workDate: logworkData.workDate,
      user,
      task,
    }as any);

    await this.em.persistAndFlush(logwork);
    return logwork;
  }

  async updateLogwork(id: number, updateData: {
    description?: string;
    hoursWorked?: number;
    workDate?: Date;
  }, userId: number, userRole: string): Promise<Logwork> {
    const logwork = await this.em.findOne(Logwork, { id }, { 
      populate: ['user'] 
    });
    if (!logwork) {
      throw new Error('Logwork not found');
    }

    // Users can only update their own logwork
    if (userRole !== 'admin' && logwork.user.id !== userId) {
      throw new Error('Access denied');
    }

    Object.assign(logwork, {
      description: updateData.description ?? logwork.description,
      hoursWorked: updateData.hoursWorked ?? logwork.hoursWorked,
      workDate: updateData.workDate ?? logwork.workDate,
    });

    await this.em.persistAndFlush(logwork);
    return logwork;
  }

  async deleteLogwork(id: number, userId: number, userRole: string): Promise<void> {
    const logwork = await this.em.findOne(Logwork, { id }, { 
      populate: ['user'] 
    });
    if (!logwork) {
      throw new Error('Logwork not found');
    }

    // Users can only delete their own logwork
    if (userRole !== 'admin' && logwork.user.id !== userId) {
      throw new Error('Access denied');
    }

    await this.em.removeAndFlush(logwork);
  }
}