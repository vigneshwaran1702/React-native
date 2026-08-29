import { create } from 'zustand';
import { apiClient } from '../services/api';
import { Task, TaskStats, SortOption, TaskCategory, TaskPriority } from '../types';

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
}

interface TaskState {
  tasks: Task[];
  stats: TaskStats | null;
  loading: boolean;
  error: string | null;

  selectedCategory: string;
  selectedPriority: string;
  selectedStatus: string;
  searchQuery: string;
  sortBy: SortOption;

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
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  stats: null,
  loading: false,
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
      set({ loading: false, error: err.response?.data?.message || 'Failed to fetch tasks' });
    }
  },

  fetchStats: async () => {
    try {
      const res = await apiClient.get('/tasks/stats');
      if (res.data?.stats) {
        set({ stats: res.data.stats });
      }
    } catch (e) {
      console.error(e);
    }
  },

  refreshAll: async () => {
    await Promise.all([get().fetchTasks(), get().fetchStats()]);
  },

  addTask: async (payload) => {
    try {
      await apiClient.post('/tasks', payload);
      await get().refreshAll();
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to create task' });
      return false;
    }
  },

  updateTask: async (id, payload) => {
    try {
      await apiClient.put(`/tasks/${id}`, payload);
      await get().refreshAll();
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update task' });
      return false;
    }
  },

  toggleComplete: async (id) => {
    const prev = [...get().tasks];
    set({
      tasks: get().tasks.map((t) =>
        t._id === id
          ? {
              ...t,
              status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
              completedAt: t.status === 'COMPLETED' ? null : new Date().toISOString(),
            }
          : t
      ),
    });

    try {
      await apiClient.patch(`/tasks/${id}/complete`);
      await get().fetchStats();
    } catch (e) {
      set({ tasks: prev });
    }
  },

  deleteTask: async (id) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      set({ tasks: get().tasks.filter((t) => t._id !== id) });
      await get().fetchStats();
      return true;
    } catch (e) {
      return false;
    }
  },

  setCategoryFilter: (category) => {
    set({ selectedCategory: category });
    get().fetchTasks();
  },

  setPriorityFilter: (priority) => {
    set({ selectedPriority: priority });
    get().fetchTasks();
  },

  setStatusFilter: (status) => {
    set({ selectedStatus: status });
    get().fetchTasks();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().fetchTasks();
  },

  setSortBy: (sort) => {
    set({ sortBy: sort });
    get().fetchTasks();
  },
}));
