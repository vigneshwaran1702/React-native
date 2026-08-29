"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TaskSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Compound index for querying user's tasks ordered by urgency/status
TaskSchema.index({ userId: 1, status: 1, urgencyScore: -1 });
TaskSchema.index({ userId: 1, deadline: 1 });
exports.Task = mongoose_1.default.model('Task', TaskSchema);
