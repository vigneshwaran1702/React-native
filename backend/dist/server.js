"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5000', 10);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo-app';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Todo Backend API',
    });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
// 404 Not Found Handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Requested API endpoint not found.',
    });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error.',
    });
});
// Connect to MongoDB & Start Server
const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB successfully.');
        app.listen(PORT, () => {
            console.log(`🚀 Todo Backend Server running on http://localhost:${PORT}`);
            console.log(`📋 Auth Routes: http://localhost:${PORT}/api/auth`);
            console.log(`📝 Task Routes: http://localhost:${PORT}/api/tasks`);
        });
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
