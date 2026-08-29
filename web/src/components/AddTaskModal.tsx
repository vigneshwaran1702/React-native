import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskCategory, TaskPriority } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];
const PRIORITIES: { label: string; value: TaskPriority }[] = [
  { label: '🟢 LOW', value: 'LOW' },
  { label: '🟡 MEDIUM', value: 'MEDIUM' },
  { label: '🔥 HIGH', value: 'HIGH' },
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('HIGH');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [hoursFromNow, setHoursFromNow] = useState(6);

  const addTask = useTaskStore((state) => state.addTask);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const deadlineDate = new Date();
    deadlineDate.setTime(deadlineDate.getTime() + hoursFromNow * 60 * 60 * 1000);

    const success = await addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      deadline: deadlineDate.toISOString(),
    });

    if (success) {
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Create New Task</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '18px' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
              TASK TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete React Native Assignment"
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
              placeholder="Task details and notes..."
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
              PRIORITY LEVEL
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
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: active ? 700 : 500,
                      background: active ? 'var(--primary)' : 'var(--input-bg)',
                      color: active ? '#fff' : 'var(--text-muted)',
                      border: '1px solid',
                      borderColor: active ? 'var(--primary)' : 'var(--input-border)',
                      textAlign: 'center'
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

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
              DUE IN (HOURS)
            </label>
            <select
              value={hoursFromNow}
              onChange={(e) => setHoursFromNow(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text)',
                outline: 'none'
              }}
            >
              <option value={2}>In 2 Hours (Urgent)</option>
              <option value={6}>In 6 Hours (Today)</option>
              <option value={24}>Tomorrow (24 Hours)</option>
              <option value={48}>In 2 Days</option>
              <option value={168}>Next Week (7 Days)</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              marginTop: '8px'
            }}
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};
