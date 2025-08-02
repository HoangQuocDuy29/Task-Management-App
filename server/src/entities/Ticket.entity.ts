// server/src/entities/Ticket.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Task } from './Task.entity';
import { User } from './User.entity';

export enum TicketStatus {
  PENDING = 'pending',
  APPROVED = 'approved', 
  REJECTED = 'rejected',
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

  @Enum(() => TicketStatus)
  status: TicketStatus = TicketStatus.PENDING;

  @Property({ nullable: true })
  priority?: string;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Task)
  task!: Task;

  @ManyToOne(() => User)
  requestBy!: User; // ✅ Match với request_by_id

  @ManyToOne(() => User, { nullable: true })
  approvedBy?: User; // ✅ Match với approved_by_id

  @Property({ nullable: true })
  requestedAt?: Date;

  @Property({ nullable: true })
  approvedAt?: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
