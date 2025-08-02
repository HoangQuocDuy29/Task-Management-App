// server/src/entities/Project.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, ManyToMany } from '@mikro-orm/core';
import { User } from './User.entity';
import { Task } from './Task.entity';

@Entity()
export class Project {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => User)
  createdBy!: User;

  @ManyToMany(() => User, 'assignedProjects', { owner: true })
  assignedUsers = new Collection<User>(this);

  @OneToMany(() => Task, task => task.project)
  tasks = new Collection<Task>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}