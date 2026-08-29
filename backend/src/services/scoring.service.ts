import { TaskPriority, TaskStatus } from '../models/Task';

/**
 * Calculates a dynamic urgency score for a task based on:
 * 1. Priority Weight (HIGH=30, MEDIUM=20, LOW=10)
 * 2. Deadline Urgency (Closer deadlines receive exponentially higher score)
 * 3. Overdue Penalty (Tasks past their deadline receive highest urgency boost)
 *
 * Completed tasks receive a negative score to naturally push them to the bottom.
 */
export const calculateUrgencyScore = (
  priority: TaskPriority,
  deadline: Date | string,
  status: TaskStatus
): number => {
  if (status === 'COMPLETED') {
    return -100;
  }

  // 1. Base Priority Weight
  let priorityWeight = 10;
  switch (priority) {
    case 'HIGH':
      priorityWeight = 30;
      break;
    case 'MEDIUM':
      priorityWeight = 20;
      break;
    case 'LOW':
      priorityWeight = 10;
      break;
  }

  // 2. Calculate remaining hours until deadline
  const now = new Date().getTime();
  const targetDate = new Date(deadline).getTime();
  const diffHours = (targetDate - now) / (1000 * 60 * 60);

  let urgencyFactor = 0;
  let overduePenalty = 0;

  if (diffHours < 0) {
    // Task is OVERDUE
    // Base overdue penalty 50 + additional points for how overdue it is
    const overdueHours = Math.abs(diffHours);
    overduePenalty = 50 + Math.min(Math.floor(overdueHours / 6) * 5, 50);
  } else if (diffHours <= 3) {
    // Critical: due within 3 hours
    urgencyFactor = 45;
  } else if (diffHours <= 6) {
    // Urgent: due within 6 hours
    urgencyFactor = 35;
  } else if (diffHours <= 24) {
    // Due today: within 24 hours
    urgencyFactor = 25;
  } else if (diffHours <= 48) {
    // Due tomorrow: within 48 hours
    urgencyFactor = 15;
  } else if (diffHours <= 168) {
    // Due this week: within 7 days
    urgencyFactor = 8;
  } else {
    // Due further out
    urgencyFactor = 2;
  }

  return priorityWeight + urgencyFactor + overduePenalty;
};
