import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './User.entity';
import { Task } from './Task.entity';

@Entity()
export class Logwork {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  description!: string;

  @Property()
  hoursWorked!: number;

  @Property()
  workDate!: Date;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Task)
  task!: Task;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}