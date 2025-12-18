export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'

export interface Task {
  id: string
  userId: string
  title: string
  description?: string | null
  priority: Priority
  status: TaskStatus
  estimatedPomodoros: number
  completedPomodoros: number
  dueDate?: Date | null
  createdAt: Date
  updatedAt: Date
  completedAt?: Date | null
  tags?: TaskTag[]
  checklistItems?: ChecklistItem[]
}

export interface TaskTag {
  id: string
  taskId: string
  name: string
  color: string
}

export interface ChecklistItem {
  id: string
  taskId: string
  content: string
  isCompleted: boolean
  order: number
  createdAt: Date
}

