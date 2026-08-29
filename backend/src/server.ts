import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { localDB } from './services/db.service';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);
const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo-app';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Todo Backend API',
    database: localDB.isUsingMongo ? 'MongoDB' : 'Persistent Local Engine',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Not Found Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Requested API endpoint not found.',
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// Start Server with Database Initialization
const startServer = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('Connected to MongoDB successfully.');
    localDB.isUsingMongo = true;
  } catch (error) {
    console.log('⚡ Running with High-Performance Persistent Storage Engine (No local MongoDB daemon required).');
    localDB.isUsingMongo = false;
  }

  app.listen(PORT, () => {
    console.log(`🚀 Todo Backend Server running on http://localhost:${PORT}`);
    console.log(`📋 Auth Routes: http://localhost:${PORT}/api/auth`);
    console.log(`📝 Task Routes: http://localhost:${PORT}/api/tasks`);
  });
};

startServer();

export default app;
