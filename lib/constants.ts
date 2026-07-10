export const POMODORO_DURATIONS = {
  FOCUS: 25 * 60, // 25 minutes in seconds
  SHORT_BREAK: 5 * 60, // 5 minutes in seconds
  LONG_BREAK: 15 * 60, // 15 minutes in seconds
} as const

export const ACHIEVEMENT_CODES = {
  FIRST_POMODORO: 'FIRST_POMODORO',
  STREAK_3: 'STREAK_3',
  STREAK_7: 'STREAK_7',
  STREAK_30: 'STREAK_30',
  COMPLETE_10_TASKS: 'COMPLETE_10_TASKS',
  FOCUS_100_HOURS: 'FOCUS_100_HOURS',
  PERFECT_WEEK: 'PERFECT_WEEK',
} as const

export const PRIORITY_COLORS = {
  LOW: '#10b981',
  MEDIUM: '#3b82f6',
  HIGH: '#f59e0b',
  URGENT: '#ef4444',
} as const

