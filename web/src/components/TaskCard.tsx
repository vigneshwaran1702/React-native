import React from 'react';
import { Task } from '../types';
import { getUrgencyInfo } from '../utils/urgency';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onSelect: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onSelect }) => {
  const isCompleted = task.status === 'COMPLETED';
  const urgency = getUrgencyInfo(task.deadline, task.priority, task.status);

  const getPriorityBadgeStyle = () => {
    switch (task.priority) {
      case 'HIGH':
        return {
          label: '🔥 HIGH',
          color: 'var(--priority-high)',
          bg: 'var(--priority-high-bg)',
          border: 'var(--priority-high-border)',
        };
      case 'MEDIUM':
        return {
          label: '🟡 MEDIUM',
          color: 'var(--priority-med)',
          bg: 'var(--priority-med-bg)',
          border: 'var(--priority-med-border)',
        };
      default:
        return {
          label: '🟢 LOW',
          color: 'var(--priority-low)',
          bg: 'var(--priority-low-bg)',
          border: 'var(--priority-low-border)',
        };
    }
  };

  const priorityMeta = getPriorityBadgeStyle();

  return (
    <div
      onClick={onSelect}
      style={{
        background: urgency.isOverdue && !isCompleted ? '#1c1524' : 'var(--card)',
        border: `1px solid ${
          urgency.isOverdue && !isCompleted ? 'rgba(239, 68, 68, 0.45)' : 'var(--card-border)'
        }`,
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        opacity: isCompleted ? 0.65 : 1,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              color: priorityMeta.color,
              background: priorityMeta.bg,
              border: `1px solid ${priorityMeta.border}`,
            }}
          >
            {priorityMeta.label}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              color: 'var(--accent)',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            📁 {task.category}
          </span>
        </div>

        {urgency.isOverdue && !isCompleted && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              color: 'var(--overdue)',
              background: 'var(--overdue-bg)',
              border: '1px solid var(--overdue)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            ⚠️ OVERDUE
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          style={{
            width: '20px',
            height: '20px',
            marginTop: '2px',
            accentColor: 'var(--primary)',
            cursor: 'pointer',
          }}
        />

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'var(--text-muted)' : 'var(--text)',
              marginBottom: '4px',
            }}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                lineHeight: 1.4,
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {task.description}
            </p>
          )}

          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: urgency.isOverdue && !isCompleted ? 'var(--overdue)' : 'var(--accent)',
            }}
          >
            {isCompleted ? '✓ Completed' : `⏰ ${urgency.dueLabel}`}
          </div>
        </div>
      </div>
    </div>
  );
};
