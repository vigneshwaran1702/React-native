import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { localDB, LocalUser } from '../services/db.service';

export interface AuthRequest extends Request {
  user?: LocalUser;
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const decoded = verifyToken(token);
    const user = await localDB.findUserById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid session or user no longer exists.',
      });
      return;
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};
