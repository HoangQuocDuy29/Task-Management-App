import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User, UserRole } from '../entities/User.entity';
import { hashPassword } from '../utils/password.utils';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Check if admin already exists
    const existingAdmin = await em.findOne(User, { email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
      return;
    }

    // Create admin user
    const adminUser = em.create(User, {
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    // Create regular users
    const users = [
      {
        email: 'john.doe@example.com',
        password: await hashPassword('user123'),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
      },
      {
        email: 'jane.smith@example.com',
        password: await hashPassword('user123'),
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.USER,
      },
    ];

    const userEntities = users.map(userData => em.create(User, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any));

    await em.persistAndFlush([adminUser, ...userEntities]);
    console.log('✅ Users seeded successfully!');
  }
}