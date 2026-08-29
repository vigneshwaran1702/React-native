import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { TaskPriority, TaskStatus, TaskCategory } from '../models/Task';
import { calculateUrgencyScore } from './scoring.service';

export interface LocalUser {
  id: string;
  _id: string;
  username: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalTask {
  id: string;
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

interface LocalDBData {
  users: LocalUser[];
  tasks: LocalTask[];
}

class LocalDatabase {
  private filePath: string;
  private data: LocalDBData = { users: [], tasks: [] };
  public isUsingMongo: boolean = false;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, 'database.json');
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (e) {
      this.data = { users: [], tasks: [] };
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database to file:', e);
    }
  }

  // USER METHODS
  async findUserById(id: string): Promise<LocalUser | null> {
    const user = this.data.users.find((u) => u.id === id || u._id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser as LocalUser;
  }

  async findUserByIdentifier(identifier: string): Promise<LocalUser | null> {
    const clean = identifier.toLowerCase().trim();
    return (
      this.data.users.find(
        (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
      ) || null
    );
  }

  async createUser(data: {
    username: string;
    name: string;
    email: string;
    password: string;
  }): Promise<LocalUser> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const id = new mongoose.Types.ObjectId().toString();
    const now = new Date().toISOString();

    const newUser: LocalUser = {
      id,
      _id: id,
      username: data.username.toLowerCase().trim(),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    this.data.users.push(newUser);
    this.save();

    const { password, ...safeUser } = newUser;
    return safeUser as LocalUser;
  }

  // TASK METHODS
  async getTasks(userId: string, filters: {
    search?: string;
    category?: string;
    priority?: string;
    status?: string;
    sortBy?: string;
  }): Promise<LocalTask[]> {
    let tasks = this.data.tasks.filter((t) => t.userId === userId);

    if (filters.category && filters.category !== 'All') {
      tasks = tasks.filter((t) => t.category === filters.category);
    }

    if (filters.priority && filters.priority !== 'All') {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }

    if (filters.status && filters.status !== 'All') {
      tasks = tasks.filter((t) => t.status === filters.status);
    }

    if (filters.search && filters.search.trim().length > 0) {
      const q = filters.search.toLowerCase().trim();
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    // Recalculate dynamic urgency score in real-time
    tasks = tasks.map((t) => ({
      ...t,
      urgencyScore: calculateUrgencyScore(t.priority, t.deadline, t.status),
    }));

    const sortBy = filters.sortBy || 'smart';
    if (sortBy === 'smart') {
      tasks.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'PENDING' ? -1 : 1;
        return (b.urgencyScore || 0) - (a.urgencyScore || 0);
      });
    } else if (sortBy === 'deadline') {
      tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'priority') {
      const rank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      tasks.sort((a, b) => rank[b.priority] - rank[a.priority]);
    } else if (sortBy === 'createdAt') {
      tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return tasks;
  }

  async getTaskStats(userId: string) {
    const tasks = this.data.tasks.filter((t) => t.userId === userId);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const pending = tasks.filter((t) => t.status === 'PENDING').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const overdue = tasks.filter(
      (t) => t.status === 'PENDING' && new Date(t.deadline).getTime() < now.getTime()
    ).length;

    const dueToday = tasks.filter((t) => {
      const d = new Date(t.deadline);
      return t.status === 'PENDING' && d >= todayStart && d <= todayEnd;
    }).length;

    const high = tasks.filter((t) => t.status === 'PENDING' && t.priority === 'HIGH').length;
    const medium = tasks.filter((t) => t.status === 'PENDING' && t.priority === 'MEDIUM').length;
    const low = tasks.filter((t) => t.status === 'PENDING' && t.priority === 'LOW').length;

    return {
      total,
      completed,
      pending,
      completionRate,
      overdue,
      dueToday,
      byPriority: { high, medium, low },
    };
  }

  async createTask(userId: string, data: {
    title: string;
    description: string;
    deadline: string;
    priority: TaskPriority;
    category: TaskCategory;
  }): Promise<LocalTask> {
    const id = new mongoose.Types.ObjectId().toString();
    const now = new Date().toISOString();
    const urgencyScore = calculateUrgencyScore(data.priority, data.deadline, 'PENDING');

    const task: LocalTask = {
      id,
      _id: id,
      userId,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: new Date(data.deadline).toISOString(),
      priority: data.priority,
      status: 'PENDING',
      category: data.category,
      urgencyScore,
      createdAt: now,
      updatedAt: now,
    };

    this.data.tasks.push(task);
    this.save();
    return task;
  }

  async getTaskById(id: string, userId: string): Promise<LocalTask | null> {
    const task = this.data.tasks.find((t) => (t.id === id || t._id === id) && t.userId === userId);
    if (!task) return null;
    return {
      ...task,
      urgencyScore: calculateUrgencyScore(task.priority, task.deadline, task.status),
    };
  }

  async updateTask(id: string, userId: string, updates: Partial<LocalTask>): Promise<LocalTask | null> {
    const index = this.data.tasks.findIndex(
      (t) => (t.id === id || t._id === id) && t.userId === userId
    );
    if (index === -1) return null;

    const task = this.data.tasks[index];
    if (updates.title !== undefined) task.title = updates.title.trim();
    if (updates.description !== undefined) task.description = updates.description.trim();
    if (updates.deadline !== undefined) task.deadline = new Date(updates.deadline).toISOString();
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.category !== undefined) task.category = updates.category;
    if (updates.status !== undefined) {
      task.status = updates.status;
      task.completedAt = updates.status === 'COMPLETED' ? new Date().toISOString() : null;
    }
    task.updatedAt = new Date().toISOString();
    task.urgencyScore = calculateUrgencyScore(task.priority, task.deadline, task.status);

    this.data.tasks[index] = task;
    this.save();
    return task;
  }

  async toggleComplete(id: string, userId: string): Promise<LocalTask | null> {
    const index = this.data.tasks.findIndex(
      (t) => (t.id === id || t._id === id) && t.userId === userId
    );
    if (index === -1) return null;

    const task = this.data.tasks[index];
    const nextStatus: TaskStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    task.status = nextStatus;
    task.completedAt = nextStatus === 'COMPLETED' ? new Date().toISOString() : null;
    task.updatedAt = new Date().toISOString();
    task.urgencyScore = calculateUrgencyScore(task.priority, task.deadline, nextStatus);

    this.data.tasks[index] = task;
    this.save();
    return task;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const initialLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(
      (t) => !((t.id === id || t._id === id) && t.userId === userId)
    );
    this.save();
    return this.data.tasks.length < initialLen;
  }
}

export const localDB = new LocalDatabase();
