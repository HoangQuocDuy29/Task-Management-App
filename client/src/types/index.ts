// src/types/index.ts
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  assignedTo: User;
  createdBy: User;
  project?: Project;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdBy: User;
  assignedUsers: User[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'resolved' | 'closed';
  priority?: string;
  notes?: string;
  task: Task;
  requestBy: User;      // ✅ Updated from createdBy
  approvedBy?: User;    // ✅ New field
  requestedAt?: string; // ✅ New field
  approvedAt?: string;  // ✅ New field
  createdAt: string;
  updatedAt: string;
}

export interface Logwork {
  id: number;
  description: string;
  hoursWorked: number;
  workDate: string;
  user: User;
  task: Task;
  createdAt: string;
  updatedAt: string;
}

// Request interfaces
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'user';
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  assignedToId: number;
  projectId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  deadline?: string;
  assignedToId?: number;
  projectId?: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  assignedUserIds?: number[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  assignedUserIds?: number[];
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  priority?: string;
  taskId: number;
  notes?: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'resolved' | 'closed';
  priority?: string;
  taskId?: number;
  notes?: string;
  approvedById?: number;
}

export interface CreateLogworkRequest {
  description: string;
  hoursWorked: number;
  workDate: string;
  taskId: number;
}

export interface UpdateLogworkRequest {
  description?: string;
  hoursWorked?: number;
  workDate?: string;
}

export * from './api';
