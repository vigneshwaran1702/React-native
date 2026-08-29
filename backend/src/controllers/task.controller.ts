import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { localDB } from '../services/db.service';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { search, category, priority, status, sortBy = 'smart' } = req.query;

    const tasks = await localDB.getTasks(userId, {
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      priority: typeof priority === 'string' ? priority : undefined,
      status: typeof status === 'string' ? status : undefined,
      sortBy: typeof sortBy === 'string' ? sortBy : undefined,
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tasks.',
    });
  }
};

export const getTaskStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const stats = await localDB.getTaskStats(userId);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task statistics.',
    });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, description = '', deadline, priority = 'MEDIUM', category = 'Work' } = req.body;

    if (!title || !deadline) {
      res.status(400).json({
        success: false,
        message: 'Task title and deadline are required.',
      });
      return;
    }

    const task = await localDB.createTask(userId, {
      title,
      description,
      deadline,
      priority,
      category,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task.',
    });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const task = await localDB.getTaskById(id, userId);
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task.',
    });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { title, description, deadline, priority, category, status } = req.body;

    const task = await localDB.updateTask(id, userId, {
      title,
      description,
      deadline,
      priority,
      category,
      status,
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task.',
    });
  }
};

export const completeTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const task = await localDB.toggleComplete(id, userId);
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.status.toLowerCase()}.`,
      task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle task completion.',
    });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const deleted = await localDB.deleteTask(id, userId);
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete task.',
    });
  }
};
