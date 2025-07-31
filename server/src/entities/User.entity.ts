import { Entity, PrimaryKey, Property, Enum, OneToMany, Collection, ManyToMany } from '@mikro-orm/core';
import { Task } from './Task.entity';
import { Project } from './Project.entity';
import { Logwork } from './Logwork.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Enum(() => UserRole)
  role: UserRole = UserRole.USER;

  @OneToMany(() => Task, task => task.assignedTo)
  assignedTasks = new Collection<Task>(this);

  @OneToMany(() => Task, task => task.createdBy)
  createdTasks = new Collection<Task>(this);

  @OneToMany(() => Project, project => project.createdBy)
  projects = new Collection<Project>(this);

  @ManyToMany(() => Project, project => project.assignedUsers)
  assignedProjects = new Collection<Project>(this);

  @OneToMany(() => Logwork, logwork => logwork.user)
  logworks = new Collection<Logwork>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}