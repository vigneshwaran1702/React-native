import { create } from 'zustand';
import { apiClient } from '../services/api';
import { Task, TaskStats, SortOption, TaskCategory, TaskPriority, TaskStatus } from '../types';

interface CreateTaskPayload {
  title: string;
  description?: string;
  deadline: string;
  priority: TaskPriority;
  category: TaskCategory;
}

interface UpdateTaskPayload {
  title?: string;
  description?: string;
  deadline?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  status?: TaskStatus;
}

interface TaskState {
  tasks: Task[];
  stats: TaskStats | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  // Filter & Search states
  selectedCategory: string;
  selectedPriority: string;
  selectedStatus: string;
  searchQuery: string;
  sortBy: SortOption;

  // Actions
  fetchTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshAll: () => Promise<void>;
  addTask: (payload: CreateTaskPayload) => Promise<boolean>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<boolean>;
  toggleComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<boolean>;

  setCategoryFilter: (category: string) => void;
  setPriorityFilter: (priority: string) => void;
  setStatusFilter: (status: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  clearFilters: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  stats: null,
  loading: false,
  refreshing: false,
  error: null,

  selectedCategory: 'All',
  selectedPriority: 'All',
  selectedStatus: 'All',
  searchQuery: '',
  sortBy: 'smart',

  fetchTasks: async () => {
    try {
      set({ loading: true, error: null });
      const { selectedCategory, selectedPriority, selectedStatus, searchQuery, sortBy } = get();

      const params: Record<string, string> = { sortBy };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedPriority !== 'All') params.priority = selectedPriority;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchQuery.trim().length > 0) params.search = searchQuery.trim();

      const res = await apiClient.get('/tasks', { params });
      set({ tasks: res.data.tasks || [], loading: false });
    } catch (err: any) {
      console.warn('Error fetching tasks:', err);
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to load tasks',
      });
    }
  },

  fetchStats: async () => {
    try {
      const res = await apiClient.get('/tasks/stats');
      if (res.data && res.data.stats) {
        set({ stats: res.data.stats });
      }
    } catch (err) {
      console.warn('Error fetching task stats:', err);
    }
  },

  refreshAll: async () => {
    set({ refreshing: true });
    await Promise.all([get().fetchTasks(), get().fetchStats()]);
    set({ refreshing: false });
  },

  addTask: async (payload: CreateTaskPayload): Promise<boolean> => {
    try {
      set({ loading: true, error: null });
      await apiClient.post('/tasks', payload);
      await get().refreshAll();
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to create task',
      });
      return false;
    }
  },

  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<boolean> => {
    try {
      set({ loading: true, error: null });
      await apiClient.put(`/tasks/${id}`, payload);
      await get().refreshAll();
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || 'Failed to update task',
      });
      return false;
    }
  },

  toggleComplete: async (id: string) => {
    // Optimistic UI update
    const previousTasks = [...get().tasks];
    set({
      tasks: get().tasks.map((task) =>
        task._id === id
          ? {
              ...task,
              status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
              completedAt: task.status === 'COMPLETED' ? null : new Date().toISOString(),
            }
          : task
      ),
    });

    try {
      await apiClient.patch(`/tasks/${id}/complete`);
      await get().fetchStats();
    } catch (err) {
      // Revert if request failed
      set({ tasks: previousTasks });
      console.warn('Failed to toggle completion:', err);
    }
  },

  deleteTask: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      set({ tasks: get().tasks.filter((t) => t._id !== id) });
      await get().fetchStats();
      return true;
    } catch (err: any) {
      console.warn('Failed to delete task:', err);
      return false;
    }
  },

  setCategoryFilter: (category: string) => {
    set({ selectedCategory: category });
    get().fetchTasks();
  },

  setPriorityFilter: (priority: string) => {
    set({ selectedPriority: priority });
    get().fetchTasks();
  },

  setStatusFilter: (status: string) => {
    set({ selectedStatus: status });
    get().fetchTasks();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().fetchTasks();
  },

  setSortBy: (sort: SortOption) => {
    set({ sortBy: sort });
    get().fetchTasks();
  },

  clearFilters: () => {
    set({
      selectedCategory: 'All',
      selectedPriority: 'All',
      selectedStatus: 'All',
      searchQuery: '',
      sortBy: 'smart',
    });
    get().fetchTasks();
  },
}));
