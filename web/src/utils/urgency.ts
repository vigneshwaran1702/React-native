import { TaskPriority, TaskStatus } from '../types';

export interface UrgencyInfo {
  isOverdue: boolean;
  dueLabel: string;
  badgeClass: string;
}

export const formatDeadline = (deadlineStr: string): string => {
  const deadline = new Date(deadlineStr);
  const now = new Date();

  if (isNaN(deadline.getTime())) return 'No deadline';

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

  if (isToday) return `Due today • ${timeStr}`;
  if (isTomorrow) return `Tomorrow • ${timeStr}`;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[deadline.getMonth()]} ${deadline.getDate()} • ${timeStr}`;
};

export const getUrgencyInfo = (deadlineStr: string, _priority: TaskPriority, status: TaskStatus): UrgencyInfo => {
  if (status === 'COMPLETED') {
    return {
      isOverdue: false,
      dueLabel: 'Completed',
      badgeClass: 'status-completed',
    };
  }

  const now = new Date().getTime();
  const deadline = new Date(deadlineStr).getTime();
  const diffHours = (deadline - now) / (1000 * 60 * 60);

  if (diffHours < 0) {
    const overdueHours = Math.floor(Math.abs(diffHours));
    const label = overdueHours < 24 ? `Overdue by ${overdueHours}h` : `Overdue by ${Math.floor(overdueHours / 24)}d`;
    return {
      isOverdue: true,
      dueLabel: label,
      badgeClass: 'status-overdue',
    };
  }

  return {
    isOverdue: false,
    dueLabel: formatDeadline(deadlineStr),
    badgeClass: 'status-pending',
  };
};
