import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Project } from '../entities/Project.entity';
import { User, UserRole } from '../entities/User.entity';

export class ProjectSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Check if projects already exist
    const existingProjects = await em.count(Project, {});
    if (existingProjects > 0) {
      console.log('Projects already exist, skipping...');
      return;
    }

    // Get admin user
    const adminUser = await em.findOne(User, { role: UserRole.ADMIN });
    if (!adminUser) {
      console.log('No admin user found, skipping project seeding');
      return;
    }

    // Get regular users
    const users = await em.find(User, { role: UserRole.USER });

    const projects = [
      {
        name: 'E-commerce Platform',
        description: 'Building a modern e-commerce platform with React and Node.js',
        createdBy: adminUser,
      },
      {
        name: 'Mobile App Development',
        description: 'Developing a cross-platform mobile application',
        createdBy: adminUser,
      },
      {
        name: 'Data Analytics Dashboard',
        description: 'Creating a comprehensive analytics dashboard for business insights',
        createdBy: adminUser,
      },
    ];

    const projectEntities = projects.map(projectData => 
      em.create(Project, {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    );

    await em.persistAndFlush(projectEntities);
    console.log('✅ Projects seeded successfully!');
  }
}