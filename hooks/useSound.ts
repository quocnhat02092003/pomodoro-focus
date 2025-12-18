'use client'

import { useEffect, useRef } from 'react'

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio context for notifications
    audioRef.current = new Audio()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playNotification = (type: 'complete' | 'start' | 'tick' = 'complete') => {
    if (!audioRef.current) return

    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Different frequencies for different notification types
    const frequencies = {
      complete: 800,
      start: 600,
      tick: 400,
    }

    oscillator.frequency.value = frequencies[type]
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const playCompleteSound = () => playNotification('complete')
  const playStartSound = () => playNotification('start')
  const playTickSound = () => playNotification('tick')

  return {
    playNotification,
    playCompleteSound,
    playStartSound,
    playTickSound,
  }
}

