import { create } from 'zustand'
import { SessionType, SessionStatus } from '@/types/pomodoro'
import { POMODORO_DURATIONS } from '@/lib/constants'

interface TimerState {
  sessionType: SessionType
  timeRemaining: number
  isRunning: boolean
  isPaused: boolean
  currentSessionId: string | null
  sessionStatus: SessionStatus
  lastTickAt: number | null
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  
  // Actions
  setSessionType: (type: SessionType) => void
  setTimeRemaining: (time: number) => void
  start: (sessionId?: string) => void
  pause: () => void
  resume: () => void
  skip: () => void
  complete: () => void
  reset: () => void
  tick: () => void
  setAutoStartBreaks: (enabled: boolean) => void
  setAutoStartPomodoros: (enabled: boolean) => void
  setDurations: (durations: { focus: number; shortBreak: number; longBreak: number }) => void
  setCurrentSessionId: (sessionId: string | null) => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  sessionType: 'FOCUS',
  timeRemaining: POMODORO_DURATIONS.FOCUS,
  isRunning: false,
  isPaused: false,
  currentSessionId: null,
  sessionStatus: 'IDLE',
  lastTickAt: null,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  focusDuration: POMODORO_DURATIONS.FOCUS,
  shortBreakDuration: POMODORO_DURATIONS.SHORT_BREAK,
  longBreakDuration: POMODORO_DURATIONS.LONG_BREAK,

  setSessionType: (type) => {
    const { focusDuration, shortBreakDuration, longBreakDuration } = get()
    const durations = {
      FOCUS: focusDuration,
      SHORT_BREAK: shortBreakDuration,
      LONG_BREAK: longBreakDuration,
    }
    set({
      sessionType: type,
      timeRemaining: durations[type],
    })
  },

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  start: (sessionId) => {
    set((state) => {
      const durations = {
        FOCUS: state.focusDuration,
        SHORT_BREAK: state.shortBreakDuration,
        LONG_BREAK: state.longBreakDuration,
      }

      const nextTime = durations[state.sessionType]

      return {
        isRunning: true,
        isPaused: false,
        sessionStatus: 'RUNNING',
        currentSessionId: sessionId || null,
        lastTickAt: Date.now(),
        timeRemaining: nextTime,
      }
    })
  },

  pause: () => {
    set({
      isRunning: false,
      isPaused: true,
      sessionStatus: 'PAUSED',
      lastTickAt: null,
    })
  },

  resume: () => {
    set({
      isRunning: true,
      isPaused: false,
      sessionStatus: 'RUNNING',
      lastTickAt: Date.now(),
    })
  },

  skip: () => {
    set({
      isRunning: false,
      isPaused: false,
      sessionStatus: 'CANCELLED',
      currentSessionId: null,
      lastTickAt: null,
    })
  },

  complete: () => {
    const { sessionType, autoStartBreaks, autoStartPomodoros } = get()
    
    set({
      isRunning: false,
      isPaused: false,
      sessionStatus: 'COMPLETED',
      timeRemaining: 0,
      lastTickAt: null,
    })

    // Auto-start next session if enabled
    if (sessionType === 'FOCUS' && autoStartBreaks) {
      setTimeout(() => {
        get().setSessionType('SHORT_BREAK')
        get().start()
      }, 1000)
    } else if (sessionType !== 'FOCUS' && autoStartPomodoros) {
      setTimeout(() => {
        get().setSessionType('FOCUS')
        get().start()
      }, 1000)
    }
  },

  reset: () => {
    const { sessionType, focusDuration, shortBreakDuration, longBreakDuration } = get()
    const durations = {
      FOCUS: focusDuration,
      SHORT_BREAK: shortBreakDuration,
      LONG_BREAK: longBreakDuration,
    }
    
    set({
      timeRemaining: durations[sessionType],
      isRunning: false,
      isPaused: false,
      sessionStatus: 'IDLE',
      currentSessionId: null,
      lastTickAt: null,
    })
  },

  tick: () => {
    const { timeRemaining, isRunning, isPaused, lastTickAt } = get()

    if (!isRunning || isPaused || timeRemaining <= 0) {
      return
    }

    const now = Date.now()
    const lastTick = lastTickAt ?? now
    const elapsedSeconds = Math.floor((now - lastTick) / 1000)

    if (elapsedSeconds <= 0) {
      return
    }

    const newTime = Math.max(0, timeRemaining - elapsedSeconds)

    set({
      timeRemaining: newTime,
      lastTickAt: lastTick + elapsedSeconds * 1000,
    })

    if (newTime === 0) {
      get().complete()
    }
  },

  setAutoStartBreaks: (enabled) => set({ autoStartBreaks: enabled }),
  setAutoStartPomodoros: (enabled) => set({ autoStartPomodoros: enabled }),

  setDurations: ({ focus, shortBreak, longBreak }) =>
    set((state) => {
      const normalized = {
        focus: Math.max(60, focus),
        shortBreak: Math.max(60, shortBreak),
        longBreak: Math.max(60, longBreak),
      }

      const durations = {
        FOCUS: normalized.focus,
        SHORT_BREAK: normalized.shortBreak,
        LONG_BREAK: normalized.longBreak,
      }

      const shouldUpdateTime = !state.isRunning && !state.isPaused
      const currentDuration = durations[state.sessionType]

      return {
        focusDuration: normalized.focus,
        shortBreakDuration: normalized.shortBreak,
        longBreakDuration: normalized.longBreak,
        ...(shouldUpdateTime ? { timeRemaining: currentDuration } : {}),
      }
    }),

  setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),
}))

