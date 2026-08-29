import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';
import { localDB } from '../services/db.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, name, email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.',
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

    // Determine clean username and name
    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = (username || cleanEmail.split('@')[0] || 'user').toLowerCase().trim();
    const cleanName = (name || cleanUsername || 'User').trim();

    // Check if user with this email or username already exists
    const existingByEmail = await localDB.findUserByIdentifier(cleanEmail);
    if (existingByEmail) {
      res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
      return;
    }

    const existingByUsername = await localDB.findUserByIdentifier(cleanUsername);
    if (existingByUsername) {
      res.status(409).json({
        success: false,
        message: 'This username is already taken. Please choose another one.',
      });
      return;
    }

    const user = await localDB.createUser({
      username: cleanUsername,
      name: cleanName,
      email: cleanEmail,
      password,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user.',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginIdentifier = (identifier || email || username || '').trim();

    if (!loginIdentifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide your email/username and password.',
      });
      return;
    }

    const user = await localDB.findUserByIdentifier(loginIdentifier);
    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid username/email or password.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid username/email or password.',
      });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in.',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: 'User session not found.',
      });
      return;
    }

    const user = await localDB.findUserById(req.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User profile not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving user profile.',
    });
  }
};
