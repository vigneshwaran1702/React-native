import mongoose, { Document, Schema } from 'mongoose';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'PENDING' | 'COMPLETED';
export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance' | 'Other';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  completedAt?: Date | null;
  urgencyScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline date/time is required'],
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED'],
      default: 'PENDING',
      index: true,
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'],
      default: 'Work',
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    urgencyScore: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user's tasks ordered by urgency/status
TaskSchema.index({ userId: 1, status: 1, urgencyScore: -1 });
TaskSchema.index({ userId: 1, deadline: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
