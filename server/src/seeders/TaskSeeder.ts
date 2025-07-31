import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Task, TaskPriority, TaskStatus } from '../entities/Task.entity';
import { User, UserRole } from '../entities/User.entity';
import { Project } from '../entities/Project.entity';

export class TaskSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Check if tasks already exist
    const existingTasks = await em.count(Task, {});
    if (existingTasks > 0) {
      console.log('Tasks already exist, skipping...');
      return;
    }

    // Get required data
    const adminUser = await em.findOne(User, { role: UserRole.ADMIN });
    const users = await em.find(User, { role: UserRole.USER });
    const projects = await em.find(Project, {});

    if (!adminUser || users.length === 0) {
      console.log('No users found, skipping task seeding');
      return;
    }

    const tasks = [
      {
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication system with login/logout functionality',
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        assignedTo: users[0],
        createdBy: adminUser,
        project: projects[0] || null,
        deadline: new Date('2024-12-31'),
      },
      {
        title: 'Design product catalog page',
        description: 'Create responsive product listing with filters and search',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        assignedTo: users[1] || users[0],
        createdBy: adminUser,
        project: projects[0] || null,
        deadline: new Date('2024-11-30'),
      },
      {
        title: 'Setup payment integration',
        description: 'Integrate Stripe payment system for order processing',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        assignedTo: users[0],
        createdBy: adminUser,
        project: projects[0] || null,
        deadline: new Date('2025-01-15'),
      },
      {
        title: 'Mobile app wireframes',
        description: 'Create detailed wireframes for all mobile app screens',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.DONE,
        assignedTo: users[1] || users[0],
        createdBy: adminUser,
        project: projects[1] || null,
        deadline: new Date('2024-10-30'),
      },
      {
        title: 'API documentation',
        description: 'Write comprehensive API documentation using Swagger',
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        assignedTo: users[0],
        createdBy: adminUser,
        project: projects[2] || null,
      },
    ];

    const taskEntities = tasks.map(taskData => 
      em.create(Task, {
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    );

    await em.persistAndFlush(taskEntities);
    console.log('✅ Tasks seeded successfully!');
  }
}