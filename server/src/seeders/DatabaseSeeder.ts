import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from './UserSeeder';
import { ProjectSeeder } from './ProjectSeeder';
import { TaskSeeder } from './TaskSeeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    // Run seeders in order
    await this.call(em, [
      UserSeeder,    // Users first
      ProjectSeeder, // Then projects
      TaskSeeder,    // Finally tasks (depends on users and projects)
    ]);
    
    console.log('✅ Database seeding completed!');
  }
}