import { Entity, PrimaryKey, Property, ManyToOne, Enum, OneToMany, Collection } from '@mikro-orm/core';
import { User } from './User.entity';
import { Project } from './Project.entity';
import { Ticket } from './Ticket.entity';
import { Logwork } from './Logwork.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity()
export class Task {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Enum(() => TaskStatus)
  status: TaskStatus = TaskStatus.TODO;

  @Enum(() => TaskPriority)
  priority: TaskPriority = TaskPriority.MEDIUM;

  @Property({ nullable: true })
  deadline?: Date;

  @ManyToOne(() => User)
  assignedTo!: User;

  @ManyToOne(() => User)
  createdBy!: User;

  @ManyToOne(() => Project, { nullable: true })
  project?: Project;

  @OneToMany(() => Ticket, ticket => ticket.task)
  tickets = new Collection<Ticket>(this);

  @OneToMany(() => Logwork, logwork => logwork.task)
  logworks = new Collection<Logwork>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}