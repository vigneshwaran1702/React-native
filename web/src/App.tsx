import React, { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { useTaskStore } from './store/taskStore';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { AddTaskModal } from './components/AddTaskModal';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { AuthModal } from './components/AuthModal';
import { Task } from './types';

export const App: React.FC = () => {
  const initAuth = useAuthStore((state) => state.initAuth);
  const user = useAuthStore((state) => state.user);

  const tasks = useTaskStore((state) => state.tasks);
  const stats = useTaskStore((state) => state.stats);
  const loading = useTaskStore((state) => state.loading);
  const searchQuery = useTaskStore((state) => state.searchQuery);
  const selectedCategory = useTaskStore((state) => state.selectedCategory);
  const selectedPriority = useTaskStore((state) => state.selectedPriority);
  const selectedStatus = useTaskStore((state) => state.selectedStatus);
  const sortBy = useTaskStore((state) => state.sortBy);

  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const fetchStats = useTaskStore((state) => state.fetchStats);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const setSearchQuery = useTaskStore((state) => state.setSearchQuery);
  const setCategoryFilter = useTaskStore((state) => state.setCategoryFilter);
  const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);
  const setSortBy = useTaskStore((state) => state.setSortBy);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchStats();
    }
  }, [user]);

  return (
    <div className="app-container">
      <Header onOpenAuth={() => setIsAuthOpen(true)} />

      {user ? (
        <>
          <StatsDashboard stats={stats} />

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategorySelect={setCategoryFilter}
            selectedPriority={selectedPriority}
            onPrioritySelect={setPriorityFilter}
            selectedStatus={selectedStatus}
            onStatusSelect={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-subtle)', letterSpacing: '0.8px' }}>
              {sortBy === 'smart' ? '⚡ SMART PRIORITIZED LIST' : 'TASKS LIST'} ({tasks.length})
            </span>

            <button
              onClick={() => setIsAddOpen(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--primary)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ＋ New Task
            </button>
          </div>

          {loading && tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>No tasks found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '360px', margin: '0 auto 16px' }}>
                {searchQuery || selectedCategory !== 'All' || selectedPriority !== 'All'
                  ? 'No tasks match your active filter.'
                  : 'You have no pending tasks. Click below to add one!'}
              </p>
              <button
                onClick={() => setIsAddOpen(true)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontWeight: 700
                }}
              >
                Create Task
              </button>
            </div>
          ) : (
            <div>
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={() => toggleComplete(task._id)}
                  onSelect={() => setSelectedTask(task)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--card)', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: '50px', marginBottom: '16px' }}>⚡</div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>TaskFlow Smart Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.5 }}>
            Sign in or create an account to organize tasks with real-time priority scoring, deadline countdowns, and cross-platform synchronization.
          </p>
          <button
            onClick={() => setIsAuthOpen(true)}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
            }}
          >
            Get Started
          </button>
        </div>
      )}

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AddTaskModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};
export default App;
