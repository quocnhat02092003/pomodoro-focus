'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Wind, Play, Pause, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest'

interface BreathingConfig {
  inhale: number
  hold: number
  exhale: number
  rest: number
}

const PRESETS: Record<string, BreathingConfig> = {
  '4-4-4-4': { inhale: 4, hold: 4, exhale: 4, rest: 4 },
  '4-7-8': { inhale: 4, hold: 7, exhale: 8, rest: 0 },
  'Box': { inhale: 4, hold: 4, exhale: 4, rest: 4 },
}

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [countdown, setCountdown] = useState(4)
  const [preset, setPreset] = useState<string>('4-4-4-4')
  const [cycle, setCycle] = useState(0)

  const config = PRESETS[preset]

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          switch (phase) {
            case 'inhale':
              setPhase('hold')
              return config.hold
            case 'hold':
              setPhase('exhale')
              return config.exhale
            case 'exhale':
              setPhase('rest')
              return config.rest
            case 'rest':
              setPhase('inhale')
              setCycle((c) => c + 1)
              return config.inhale
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase, config])

  const handleStart = () => {
    setIsActive(true)
    setPhase('inhale')
    setCountdown(config.inhale)
    setCycle(0)
  }

  const handleStop = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setPhase('inhale')
    setCountdown(config.inhale)
    setCycle(0)
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-500 to-cyan-500'
      case 'hold':
        return 'from-purple-500 to-pink-500'
      case 'exhale':
        return 'from-orange-500 to-red-500'
      case 'rest':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-blue-500 to-cyan-500'
    }
  }

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe Out'
      case 'rest':
        return 'Rest'
      default:
        return ''
    }
  }

  const scale = phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.1 : phase === 'exhale' ? 0.8 : 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary-400" />
          Breathing Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isActive && (
          <div className="flex gap-2">
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => setPreset(key)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${preset === key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                {key}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{
              scale: isActive ? scale : 1,
            }}
            transition={{
              duration: config[phase],
              ease: phase === 'inhale' ? 'easeOut' : phase === 'exhale' ? 'easeIn' : 'linear',
            }}
            className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-lg`}
          >
            <div className="text-center">
              <p className="text-white text-4xl font-bold mb-2">{isActive ? countdown : '—'}</p>
              <p className="text-white/80 text-sm">{getPhaseLabel()}</p>
            </div>
          </motion.div>
        </div>

        {isActive && cycle > 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Cycle {cycle} completed
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <Button onClick={handleStart} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start
            </Button>
          ) : (
            <>
              <Button onClick={handleStop} variant="secondary" className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button onClick={handleReset} variant="ghost" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Follow the breathing pattern</p>
          <p>• Inhale through your nose</p>
          <p>• Exhale through your mouth</p>
          <p>• Focus on the rhythm</p>
        </div>
      </CardContent>
    </Card>
  )
}

