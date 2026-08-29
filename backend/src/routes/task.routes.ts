import { Router } from 'express';
import {
  getTasks,
  getTaskStats,
  createTask,
  getTaskById,
  updateTask,
  completeTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All task routes require JWT authentication
router.use(authenticate);

router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
