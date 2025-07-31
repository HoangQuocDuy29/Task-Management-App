import { Migration } from '@mikro-orm/migrations';

export class Migration20250731041932 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "role" text check ("role" in ('admin', 'user')) not null default 'user', "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "project" ("id" serial primary key, "name" varchar(255) not null, "description" text null, "created_by_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "task" ("id" serial primary key, "title" varchar(255) not null, "description" text null, "status" text check ("status" in ('todo', 'in_progress', 'done')) not null default 'todo', "priority" text check ("priority" in ('low', 'medium', 'high')) not null default 'medium', "deadline" timestamptz null, "assigned_to_id" int not null, "created_by_id" int not null, "project_id" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`alter table "project" add constraint "project_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "task" add constraint "task_assigned_to_id_foreign" foreign key ("assigned_to_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "task" add constraint "task_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "task" add constraint "task_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "project" drop constraint "project_created_by_id_foreign";`);

    this.addSql(`alter table "task" drop constraint "task_assigned_to_id_foreign";`);

    this.addSql(`alter table "task" drop constraint "task_created_by_id_foreign";`);

    this.addSql(`alter table "task" drop constraint "task_project_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "project" cascade;`);

    this.addSql(`drop table if exists "task" cascade;`);
  }

}
