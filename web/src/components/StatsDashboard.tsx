import React from 'react';
import { TaskStats } from '../types';

interface StatsProps {
  stats: TaskStats | null;
}

export const StatsDashboard: React.FC<StatsProps> = ({ stats }) => {
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;
  const rate = stats?.completionRate ?? 0;
  const overdue = stats?.overdue ?? 0;

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--card-border)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-subtle)', letterSpacing: '0.8px' }}>
          MY TASKS OVERVIEW
        </span>
        {overdue > 0 && (
          <span style={{
            background: 'var(--overdue-bg)',
            border: '1px solid var(--overdue)',
            color: 'var(--overdue)',
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            🔴 {overdue} Overdue
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
        <div style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          borderRadius: '12px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '26px', fontWeight: 800 }}>{total}</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>TOTAL</div>
        </div>

        <div style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          borderRadius: '12px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--success)' }}>{completed}</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>DONE</div>
        </div>

        <div style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          borderRadius: '12px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent)' }}>{pending}</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>PENDING</div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Completion Progress</span>
          <span style={{ color: 'var(--text)', fontWeight: 700 }}>{rate}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--input-bg)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${rate}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>
    </div>
  );
};
