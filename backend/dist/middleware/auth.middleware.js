"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No authentication token provided.',
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Malformed authorization token.',
            });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await User_1.User.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid session or user no longer exists.',
            });
            return;
        }
        req.user = user;
        req.userId = user._id.toString();
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};
exports.authenticate = authenticate;
