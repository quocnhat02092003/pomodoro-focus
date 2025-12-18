export type SessionType = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'

export type SessionStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

export interface PomodoroSession {
  id: string
  userId: string
  taskId?: string | null
  type: SessionType
  duration: number
  remainingTime: number
  status: SessionStatus
  startedAt?: Date | null
  completedAt?: Date | null
  pausedAt?: Date | null
  pausedDuration: number
  createdAt: Date
}

export interface PomodoroSettings {
  focusDuration: number // in seconds
  shortBreakDuration: number
  longBreakDuration: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number // number of pomodoros before long break
  soundEnabled: boolean
  soundVolume: number
}

