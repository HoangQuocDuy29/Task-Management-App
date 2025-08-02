// server/src/migrations/Migration20250801165658.ts
import { Migration } from '@mikro-orm/migrations';

export class Migration20250801165658 extends Migration {

  async up(): Promise<void> {
    // Create junction table for Project <-> User ManyToMany
    this.addSql(`
      create table "project_assigned_users" (
        "project_id" int not null, 
        "user_id" int not null, 
        constraint "project_assigned_users_pkey" primary key ("project_id", "user_id")
      );
    `);

    // Add foreign key constraints
    this.addSql(`
      alter table "project_assigned_users" 
      add constraint "project_assigned_users_project_id_foreign" 
      foreign key ("project_id") references "project" ("id") 
      on update cascade on delete cascade;
    `);

    this.addSql(`
      alter table "project_assigned_users" 
      add constraint "project_assigned_users_user_id_foreign" 
      foreign key ("user_id") references "user" ("id") 
      on update cascade on delete cascade;
    `);

    // Create indexes for performance
    this.addSql(`
      create index "project_assigned_users_project_id_index" 
      on "project_assigned_users" ("project_id");
    `);

    this.addSql(`
      create index "project_assigned_users_user_id_index" 
      on "project_assigned_users" ("user_id");
    `);
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "project_assigned_users" cascade;`);
  }
}
