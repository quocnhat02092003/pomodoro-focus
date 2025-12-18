'use client'

import { useEffect } from 'react'
import { useTimerStore } from '@/stores/timer-store'
import { useUIStore } from '@/stores/ui-store'

export function useKeyboardShortcuts() {
  const { isRunning, isPaused, pause, resume, skip, setSessionType } = useTimerStore()
  const { focusMode, setFocusMode } = useUIStore()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      // ESC: Exit focus mode
      if (e.key === 'Escape' && focusMode) {
        setFocusMode(false)
        return
      }

      // Space: Start/Pause/Resume timer
      if (e.key === ' ' && !e.shiftKey) {
        e.preventDefault()
        if (!isRunning && !isPaused) {
          // Start timer (would need to trigger start action)
        } else if (isRunning) {
          pause()
        } else if (isPaused) {
          resume()
        }
        return
      }

      // Number keys: Switch session type
      if (e.key === '1') {
        setSessionType('FOCUS')
      } else if (e.key === '2') {
        setSessionType('SHORT_BREAK')
      } else if (e.key === '3') {
        setSessionType('LONG_BREAK')
      }

      // S: Skip current session
      if (e.key === 's' || e.key === 'S') {
        if (isRunning || isPaused) {
          skip()
        }
      }

      // F: Toggle focus mode
      if (e.key === 'f' || e.key === 'F') {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          setFocusMode(!focusMode)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isRunning, isPaused, focusMode, pause, resume, skip, setSessionType, setFocusMode])
}

