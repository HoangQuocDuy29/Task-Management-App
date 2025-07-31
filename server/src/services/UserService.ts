import { EntityManager } from '@mikro-orm/core';
import { User, UserRole } from '../entities/User.entity';
import { hashPassword } from '../utils/password.utils';

export class UserService {
  constructor(private em: EntityManager) {}

  async getAllUsers(): Promise<User[]> {
    return this.em.find(User, {}, { 
      populate: ['assignedTasks', 'projects'] 
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.em.findOne(User, { id }, { 
      populate: ['assignedTasks', 'projects', 'logworks'] 
    });
  }

  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }): Promise<User> {
    const existingUser = await this.em.findOne(User, { email: userData.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = this.em.create(User, {
      ...userData,
      password: hashedPassword,
    }as any);

    await this.em.persistAndFlush(user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new Error('User not found');
    }

    if (updateData.email) {
      const existingUser = await this.em.findOne(User, { 
        email: updateData.email,
        id: { $ne: id } 
      });
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    Object.assign(user, updateData);
    await this.em.persistAndFlush(user);
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new Error('User not found');
    }

    await this.em.removeAndFlush(user);
  }

  async changeUserRole(id: number, role: UserRole): Promise<User> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;
    await this.em.persistAndFlush(user);
    return user;
  }
}