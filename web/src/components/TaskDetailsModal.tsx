import React, { useState } from 'react';
import { Task, TaskCategory, TaskPriority } from '../types';
import { useTaskStore } from '../store/taskStore';
import { getUrgencyInfo } from '../utils/urgency';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
}

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];
const PRIORITIES: { label: string; value: TaskPriority }[] = [
  { label: '🟢 LOW', value: 'LOW' },
  { label: '🟡 MEDIUM', value: 'MEDIUM' },
  { label: '🔥 HIGH', value: 'HIGH' },
];

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  if (!task) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [category, setCategory] = useState<TaskCategory>(task.category);

  const updateTask = useTaskStore((state) => state.updateTask);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const isCompleted = task.status === 'COMPLETED';
  const urgency = getUrgencyInfo(task.deadline, task.priority, task.status);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask(task._id, {
      title,
      description,
      priority,
      category,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
            {isEditing ? 'Edit Task' : 'Task Details'}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 700 }}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '18px', marginLeft: '8px' }}>
              ✕
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                TITLE
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                PRIORITY
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {PRIORITIES.map((p) => {
                  const active = priority === p.value;
                  return (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: active ? 700 : 500,
                        background: active ? 'var(--primary)' : 'var(--input-bg)',
                        color: active ? '#fff' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: active ? 'var(--primary)' : 'var(--input-border)'
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                CATEGORY
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => {
                  const active = category === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: active ? 700 : 500,
                        background: active ? 'var(--primary)' : 'var(--input-bg)',
                        color: active ? '#fff' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: active ? 'var(--primary)' : 'var(--input-border)'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: 'var(--primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                marginTop: '10px'
              }}
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: 'var(--input-bg)', color: 'var(--text)' }}>
                {task.priority}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent)' }}>
                📁 {task.category}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: isCompleted ? 'var(--success-bg)' : 'rgba(99, 102, 241, 0.15)', color: isCompleted ? 'var(--success)' : 'var(--primary)' }}>
                {task.status}
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>
              {task.title}
            </h3>

            <div style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--input-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>DESCRIPTION</div>
              <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
                {task.description || 'No description provided.'}
              </p>
            </div>

            <div style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--input-border)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>⏰ Deadline</span>
                <span style={{ fontWeight: 600, color: urgency.isOverdue && !isCompleted ? 'var(--overdue)' : 'var(--accent)' }}>
                  {urgency.dueLabel}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>⚡ Urgency Score</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {task.urgencyScore !== undefined ? `${task.urgencyScore} pts` : 'N/A'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleComplete(task._id)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  background: isCompleted ? 'var(--input-bg)' : 'var(--primary)',
                  color: '#fff',
                  fontWeight: 700,
                  border: isCompleted ? '1px solid var(--card-border)' : 'none'
                }}
              >
                {isCompleted ? '↺ Mark Pending' : '✓ Mark Completed'}
              </button>

              <button
                onClick={handleDelete}
                style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: 'var(--overdue-bg)',
                  border: '1px solid var(--overdue)',
                  color: 'var(--overdue)',
                  fontWeight: 700
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
