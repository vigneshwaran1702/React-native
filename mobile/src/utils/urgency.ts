import { TaskPriority, TaskStatus } from '../types';

export interface UrgencyInfo {
  isOverdue: boolean;
  dueLabel: string;
  badgeColor: string;
  badgeBg: string;
  score: number;
}

export const formatDeadlineText = (deadlineStr: string): string => {
  const deadline = new Date(deadlineStr);
  const now = new Date();

  if (isNaN(deadline.getTime())) {
    return 'No deadline';
  }

  const isToday =
    deadline.getDate() === now.getDate() &&
    deadline.getMonth() === now.getMonth() &&
    deadline.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    deadline.getDate() === tomorrow.getDate() &&
    deadline.getMonth() === tomorrow.getMonth() &&
    deadline.getFullYear() === tomorrow.getFullYear();

  const timeStr = deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return `Due today • ${timeStr}`;
  }
  if (isTomorrow) {
    return `Tomorrow • ${timeStr}`;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[deadline.getMonth()]} ${deadline.getDate()} • ${timeStr}`;
};

export const getUrgencyInfo = (
  deadlineStr: string,
  priority: TaskPriority,
  status: TaskStatus
): UrgencyInfo => {
  if (status === 'COMPLETED') {
    return {
      isOverdue: false,
      dueLabel: 'Completed',
      badgeColor: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      score: -100,
    };
  }

  const now = new Date().getTime();
  const deadline = new Date(deadlineStr).getTime();
  const diffHours = (deadline - now) / (1000 * 60 * 60);
  const isOverdue = diffHours < 0;

  let priorityWeight = 10;
  if (priority === 'HIGH') priorityWeight = 30;
  if (priority === 'MEDIUM') priorityWeight = 20;

  let dueLabel = formatDeadlineText(deadlineStr);

  if (isOverdue) {
    const overdueHours = Math.floor(Math.abs(diffHours));
    if (overdueHours < 1) {
      dueLabel = 'Overdue just now';
    } else if (overdueHours < 24) {
      dueLabel = `Overdue by ${overdueHours}h`;
    } else {
      const overdueDays = Math.floor(overdueHours / 24);
      dueLabel = `Overdue by ${overdueDays}d`;
    }

    return {
      isOverdue: true,
      dueLabel,
      badgeColor: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      score: priorityWeight + 50 + Math.min(Math.floor(overdueHours / 6) * 5, 50),
    };
  }

  let urgencyFactor = 2;
  if (diffHours <= 3) urgencyFactor = 45;
  else if (diffHours <= 6) urgencyFactor = 35;
  else if (diffHours <= 24) urgencyFactor = 25;
  else if (diffHours <= 48) urgencyFactor = 15;
  else if (diffHours <= 168) urgencyFactor = 8;

  let badgeColor = '#10B981';
  let badgeBg = 'rgba(16, 185, 129, 0.15)';
  if (priority === 'HIGH' || diffHours <= 6) {
    badgeColor = '#F43F5E';
    badgeBg = 'rgba(244, 63, 94, 0.15)';
  } else if (priority === 'MEDIUM' || diffHours <= 24) {
    badgeColor = '#F59E0B';
    badgeBg = 'rgba(245, 158, 11, 0.15)';
  }

  return {
    isOverdue: false,
    dueLabel,
    badgeColor,
    badgeBg,
    score: priorityWeight + urgencyFactor,
  };
};
