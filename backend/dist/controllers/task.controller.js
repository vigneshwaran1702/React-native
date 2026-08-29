"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.completeTask = exports.updateTask = exports.getTaskById = exports.createTask = exports.getTaskStats = exports.getTasks = void 0;
const Task_1 = require("../models/Task");
const scoring_service_1 = require("../services/scoring.service");
const getTasks = async (req, res) => {
    try {
        const userId = req.userId;
        const { search, category, priority, status, sortBy = 'smart' } = req.query;
        const query = { userId };
        if (category && category !== 'All') {
            query.category = category;
        }
        if (priority && priority !== 'All') {
            query.priority = priority;
        }
        if (status && status !== 'All') {
            query.status = status;
        }
        if (search && typeof search === 'string' && search.trim().length > 0) {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } },
            ];
        }
        let tasks = await Task_1.Task.find(query).lean();
        // Recalculate dynamic urgency score in real-time
        tasks = tasks.map((task) => ({
            ...task,
            urgencyScore: (0, scoring_service_1.calculateUrgencyScore)(task.priority, task.deadline, task.status),
        }));
        // Sorting options
        if (sortBy === 'smart') {
            // Pending first with highest urgency score, then completed
            tasks.sort((a, b) => {
                if (a.status !== b.status) {
                    return a.status === 'PENDING' ? -1 : 1;
                }
                return (b.urgencyScore || 0) - (a.urgencyScore || 0);
            });
        }
        else if (sortBy === 'deadline') {
            tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        }
        else if (sortBy === 'priority') {
            const priorityRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            tasks.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
        }
        else if (sortBy === 'createdAt') {
            tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch tasks.',
        });
    }
};
exports.getTasks = getTasks;
const getTaskStats = async (req, res) => {
    try {
        const userId = req.userId;
        const tasks = await Task_1.Task.find({ userId });
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
        const pending = tasks.filter((t) => t.status === 'PENDING').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const overdue = tasks.filter((t) => t.status === 'PENDING' && new Date(t.deadline).getTime() < now.getTime()).length;
        const dueToday = tasks.filter((t) => {
            const d = new Date(t.deadline);
            return t.status === 'PENDING' && d >= todayStart && d <= todayEnd;
        }).length;
        const highPriority = tasks.filter((t) => t.status === 'PENDING' && t.priority === 'HIGH').length;
        const mediumPriority = tasks.filter((t) => t.status === 'PENDING' && t.priority === 'MEDIUM').length;
        const lowPriority = tasks.filter((t) => t.status === 'PENDING' && t.priority === 'LOW').length;
        res.status(200).json({
            success: true,
            stats: {
                total,
                completed,
                pending,
                completionRate,
                overdue,
                dueToday,
                byPriority: {
                    high: highPriority,
                    medium: mediumPriority,
                    low: lowPriority,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch task statistics.',
        });
    }
};
exports.getTaskStats = getTaskStats;
const createTask = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, description = '', deadline, priority = 'MEDIUM', category = 'Work' } = req.body;
        if (!title || !deadline) {
            res.status(400).json({
                success: false,
                message: 'Task title and deadline are required.',
            });
            return;
        }
        const urgencyScore = (0, scoring_service_1.calculateUrgencyScore)(priority, deadline, 'PENDING');
        const task = await Task_1.Task.create({
            userId,
            title: title.trim(),
            description: description.trim(),
            deadline: new Date(deadline),
            priority,
            status: 'PENDING',
            category,
            urgencyScore,
        });
        res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            task,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create task.',
        });
    }
};
exports.createTask = createTask;
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const task = await Task_1.Task.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
            return;
        }
        const urgencyScore = (0, scoring_service_1.calculateUrgencyScore)(task.priority, task.deadline, task.status);
        const taskObj = task.toObject();
        taskObj.urgencyScore = urgencyScore;
        res.status(200).json({
            success: true,
            task: taskObj,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch task.',
        });
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { title, description, deadline, priority, category, status } = req.body;
        const task = await Task_1.Task.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
            return;
        }
        if (title !== undefined)
            task.title = title.trim();
        if (description !== undefined)
            task.description = description.trim();
        if (deadline !== undefined)
            task.deadline = new Date(deadline);
        if (priority !== undefined)
            task.priority = priority;
        if (category !== undefined)
            task.category = category;
        if (status !== undefined) {
            task.status = status;
            task.completedAt = status === 'COMPLETED' ? new Date() : null;
        }
        task.urgencyScore = (0, scoring_service_1.calculateUrgencyScore)(task.priority, task.deadline, task.status);
        await task.save();
        res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
            task,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update task.',
        });
    }
};
exports.updateTask = updateTask;
const completeTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const task = await Task_1.Task.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Task not found.',
            });
            return;
        }
        const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        task.status = nextStatus;
        task.completedAt = nextStatus === 'COMPLETED' ? new Date() : null;
        task.urgencyScore = (0, scoring_service_1.calculateUrgencyScore)(task.priority, task.deadline, nextStatus);
        await task.save();
        res.status(200).json({
            success: true,
            message: `Task marked as ${nextStatus.toLowerCase()}.`,
            task,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to toggle task completion.',
        });
    }
};
exports.completeTask = completeTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const task = await Task_1.Task.findOneAndDelete({ _id: id, userId });
        if (!task) {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete task.',
        });
    }
};
exports.deleteTask = deleteTask;
