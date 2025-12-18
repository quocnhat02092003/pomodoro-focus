import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function calculateXP(pomodoroDuration: number, sessionType: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'): number {
  if (sessionType === 'FOCUS') {
    return Math.floor(pomodoroDuration / 60) * 10 // 10 XP per minute of focus
  }
  return 0 // Breaks don't give XP
}

export function calculateLevel(xp: number): number {
  // Level formula: level = sqrt(xp / 100)
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100
}

