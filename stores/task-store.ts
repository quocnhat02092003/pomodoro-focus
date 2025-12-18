import { create } from 'zustand'
import { Task, TaskStatus, Priority } from '@/types/task'

interface TaskState {
  tasks: Task[]
  selectedTask: Task | null
  filters: {
    status?: TaskStatus
    priority?: Priority
    tag?: string
    search?: string
  }
  isLoading: boolean
  
  // Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  selectTask: (task: Task | null) => void
  setFilter: (filter: Partial<TaskState['filters']>) => void
  clearFilters: () => void
  setLoading: (loading: boolean) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTask: null,
  filters: {},
  isLoading: false,

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
      selectedTask:
        state.selectedTask?.id === id
          ? { ...state.selectedTask, ...updates }
          : state.selectedTask,
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    })),

  selectTask: (task) => set({ selectedTask: task }),

  setFilter: (filter) =>
    set((state) => ({
      filters: { ...state.filters, ...filter },
    })),

  clearFilters: () => set({ filters: {} }),

  setLoading: (loading) => set({ isLoading: loading }),
}))

