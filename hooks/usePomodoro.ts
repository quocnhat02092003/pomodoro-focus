"use client"

import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/stores/timer-store'
import { useSpotifyStore } from '@/stores/spotify-store'
import { useSound } from './useSound'
import { formatTime } from '@/lib/utils'

export function usePomodoro() {
  const { playCompleteSound, playStartSound } = useSound()
  const {
    timeRemaining,
    isRunning,
    isPaused,
    sessionType,
    sessionStatus,
    start,
    pause,
    resume,
    tick,
  } = useTimerStore()

  const { autoPlay, autoPause, isPlaying, setPlaying } = useSpotifyStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const baseTitle = 'Pomodoro Focus'

    if (typeof document === 'undefined') return

    if (isRunning || isPaused) {
      const sessionLabels = {
        FOCUS: 'Focus',
        SHORT_BREAK: 'Short Break',
        LONG_BREAK: 'Long Break',
      }
      const prefix = isPaused ? '⏸' : '⏱'
      document.title = `${prefix} ${formatTime(timeRemaining)} • ${sessionLabels[sessionType]}`
    } else {
      document.title = baseTitle
    }

    return () => {
      document.title = baseTitle
    }
  }, [isRunning, isPaused, timeRemaining, sessionType])

  // Drive the timer via the store's tick function
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      tick()
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, isPaused, tick])

  // Handle completion side-effects (sound, Spotify auto-pause)
  useEffect(() => {
    if (sessionStatus !== 'COMPLETED') return

    playCompleteSound()

    if (autoPause && isPlaying) {
      setPlaying(false)
    }
  }, [sessionStatus, playCompleteSound, autoPause, isPlaying, setPlaying])

  // Handle timer start
  const handleStart = (sessionId?: string) => {
    start(sessionId)
    playStartSound()

    if (autoPlay && !isPlaying) {
      setPlaying(true)
    }
  }

  const handlePause = () => {
    pause()
  }

  const handleResume = () => {
    resume()
  }

  const handleSkip = () => {
    useTimerStore.getState().skip()
  }

  return {
    timeRemaining,
    isRunning,
    isPaused,
    sessionType,
    sessionStatus,
    start: handleStart,
    pause: handlePause,
    resume: handleResume,
    skip: handleSkip,
  }
}
