import React from 'react';
import { SortOption } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategorySelect: (c: string) => void;
  selectedPriority: string;
  onPrioritySelect: (p: string) => void;
  selectedStatus: string;
  onStatusSelect: (s: string) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
}

const CATEGORIES = ['All', 'Work', 'Personal', 'Study', 'Health', 'Finance', 'Other'];
const PRIORITIES = ['All', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['All', 'PENDING', 'COMPLETED'];
const SORTS: { label: string; value: SortOption }[] = [
  { label: '⚡ Smart Urgency', value: 'smart' },
  { label: '⏰ Due Date', value: 'deadline' },
  { label: '🔥 Priority', value: 'priority' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  selectedPriority,
  onPrioritySelect,
  selectedStatus,
  onStatusSelect,
  sortBy,
  onSortChange,
}) => {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--input-bg)',
        border: '1px solid var(--input-border)',
        borderRadius: '12px',
        padding: '10px 14px',
        gap: '10px'
      }}>
        <span style={{ fontSize: '15px' }}>🔍</span>
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: '14px',
            width: '100%'
          }}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')} style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            ✕
          </button>
        )}
      </div>

      {/* Sort Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginRight: '4px' }}>
          SORT:
        </span>
        {SORTS.map((s) => {
          const active = sortBy === s.value;
          return (
            <button
              key={s.value}
              onClick={() => onSortChange(s.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: active ? 700 : 500,
                background: active ? 'var(--primary)' : 'rgba(99, 102, 241, 0.1)',
                color: active ? '#fff' : 'var(--accent)',
                border: '1px solid',
                borderColor: active ? 'var(--primary)' : 'rgba(99, 102, 241, 0.25)'
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Categories Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginRight: '4px' }}>
          CATEGORY:
        </span>
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: active ? 700 : 500,
                background: active ? 'var(--primary)' : 'var(--card)',
                color: active ? '#fff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: active ? 'var(--primary)' : 'var(--card-border)',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Priority and Status Filters */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)' }}>PRIORITY:</span>
          {PRIORITIES.map((p) => {
            const active = selectedPriority === p;
            return (
              <button
                key={p}
                onClick={() => onPrioritySelect(p)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: active ? 700 : 500,
                  background: active ? 'var(--primary)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: active ? 'var(--primary)' : 'var(--card-border)'
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)' }}>STATUS:</span>
          {STATUSES.map((st) => {
            const active = selectedStatus === st;
            return (
              <button
                key={st}
                onClick={() => onStatusSelect(st)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: active ? 700 : 500,
                  background: active ? 'var(--primary)' : 'var(--card)',
                  color: active ? '#fff' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: active ? 'var(--primary)' : 'var(--card-border)'
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
