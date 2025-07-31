import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Task } from './Task.entity';
import { User } from './User.entity';

export enum TicketType {
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity()
export class Ticket {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Enum(() => TicketType)
  type: TicketType = TicketType.BUG;

  @Enum(() => TicketStatus)
  status: TicketStatus = TicketStatus.OPEN;

  @ManyToOne(() => Task)
  task!: Task;

  @ManyToOne(() => User)
  createdBy!: User;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}