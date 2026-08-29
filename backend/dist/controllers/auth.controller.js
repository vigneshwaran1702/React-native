"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Name, email, and password are required.',
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.',
            });
            return;
        }
        const existingUser = await User_1.User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'An account with this email address already exists.',
            });
            return;
        }
        const user = await User_1.User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
        });
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
        });
        res.status(201).json({
            success: true,
            message: 'Account registered successfully.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error registering user.',
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide both email and password.',
            });
            return;
        }
        const user = await User_1.User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
            return;
        }
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
        });
        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error logging in.',
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User session not found.',
            });
            return;
        }
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                createdAt: req.user.createdAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving user profile.',
        });
    }
};
exports.getMe = getMe;
