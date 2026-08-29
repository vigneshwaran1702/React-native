export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'PENDING' | 'COMPLETED';
export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance' | 'Other';
export type SortOption = 'smart' | 'deadline' | 'priority' | 'createdAt';

export interface User {
  id: string;
  username?: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  completedAt?: string | null;
  urgencyScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  overdue: number;
  dueToday: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}
