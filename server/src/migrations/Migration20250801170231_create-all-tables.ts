// server/src/migrations/Migration20250801170231_create-all-tables.ts
import { Migration } from '@mikro-orm/migrations';

export class Migration20250801170231 extends Migration {

  async up(): Promise<void> {
    // Create User table
    this.addSql(`
      create table "user" (
        "id" serial primary key,
        "email" varchar(255) not null unique,
        "password" varchar(255) not null,
        "first_name" varchar(255) not null,
        "last_name" varchar(255) not null,
        "role" varchar(50) not null default 'user',
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now()
      );
    `);

    // Create Project table
    this.addSql(`
      create table "project" (
        "id" serial primary key,
        "name" varchar(255) not null,
        "description" text,
        "created_by_id" int not null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        constraint "project_created_by_id_foreign" 
        foreign key ("created_by_id") references "user" ("id")
      );
    `);

    // Create Task table
    this.addSql(`
      create table "task" (
        "id" serial primary key,
        "title" varchar(255) not null,
        "description" text,
        "status" varchar(50) not null default 'todo',
        "priority" varchar(50) not null default 'medium',
        "deadline" timestamptz,
        "assigned_to_id" int not null,
        "created_by_id" int not null,
        "project_id" int,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        constraint "task_assigned_to_id_foreign" 
        foreign key ("assigned_to_id") references "user" ("id"),
        constraint "task_created_by_id_foreign" 
        foreign key ("created_by_id") references "user" ("id"),
        constraint "task_project_id_foreign" 
        foreign key ("project_id") references "project" ("id")
      );
    `);

    // Create Ticket table
    this.addSql(`
      create table "ticket" (
        "id" serial primary key,
        "title" varchar(255) not null,
        "description" text,
        "type" varchar(50) not null default 'bug',
        "status" varchar(50) not null default 'open',
        "task_id" int not null,
        "created_by_id" int not null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        constraint "ticket_task_id_foreign" 
        foreign key ("task_id") references "task" ("id"),
        constraint "ticket_created_by_id_foreign" 
        foreign key ("created_by_id") references "user" ("id")
      );
    `);

    // Create Logwork table
    this.addSql(`
      create table "logwork" (
        "id" serial primary key,
        "description" text not null,
        "hours_worked" decimal(5,2) not null,
        "work_date" date not null,
        "user_id" int not null,
        "task_id" int not null,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        constraint "logwork_user_id_foreign" 
        foreign key ("user_id") references "user" ("id"),
        constraint "logwork_task_id_foreign" 
        foreign key ("task_id") references "task" ("id")
      );
    `);

    // Create Project-Users junction table
    this.addSql(`
      create table "project_assigned_users" (
        "project_id" int not null,
        "user_id" int not null,
        constraint "project_assigned_users_pkey" 
        primary key ("project_id", "user_id"),
        constraint "project_assigned_users_project_id_foreign" 
        foreign key ("project_id") references "project" ("id") on delete cascade,
        constraint "project_assigned_users_user_id_foreign" 
        foreign key ("user_id") references "user" ("id") on delete cascade
      );
    `);

    // Create indexes for performance
    this.addSql(`create index "user_email_index" on "user" ("email");`);
    this.addSql(`create index "task_assigned_to_id_index" on "task" ("assigned_to_id");`);
    this.addSql(`create index "task_project_id_index" on "task" ("project_id");`);
    this.addSql(`create index "ticket_task_id_index" on "ticket" ("task_id");`);
    this.addSql(`create index "logwork_user_id_index" on "logwork" ("user_id");`);
    this.addSql(`create index "logwork_task_id_index" on "logwork" ("task_id");`);
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "project_assigned_users" cascade;`);
    this.addSql(`drop table if exists "logwork" cascade;`);
    this.addSql(`drop table if exists "ticket" cascade;`);
    this.addSql(`drop table if exists "task" cascade;`);
    this.addSql(`drop table if exists "project" cascade;`);
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
