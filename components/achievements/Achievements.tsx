'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Trophy, Star, Flame, Target, Zap } from 'lucide-react'
import { ACHIEVEMENT_CODES } from '@/lib/constants'

interface Achievement {
  code: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  unlockedAt?: string
}

export function Achievements() {
  const achievements: Achievement[] = [
    {
      code: ACHIEVEMENT_CODES.FIRST_POMODORO,
      name: 'First Step',
      description: 'Complete your first pomodoro',
      icon: <Star className="w-6 h-6" />,
      unlocked: true,
      unlockedAt: '2024-01-01',
    },
    {
      code: ACHIEVEMENT_CODES.STREAK_3,
      name: 'On Fire',
      description: 'Maintain a 3-day streak',
      icon: <Flame className="w-6 h-6" />,
      unlocked: true,
      unlockedAt: '2024-01-05',
    },
    {
      code: ACHIEVEMENT_CODES.STREAK_7,
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: <Trophy className="w-6 h-6" />,
      unlocked: false,
    },
    {
      code: ACHIEVEMENT_CODES.COMPLETE_10_TASKS,
      name: 'Task Master',
      description: 'Complete 10 tasks',
      icon: <Target className="w-6 h-6" />,
      unlocked: false,
    },
    {
      code: ACHIEVEMENT_CODES.FOCUS_100_HOURS,
      name: 'Centurion',
      description: 'Focus for 100 hours total',
      icon: <Zap className="w-6 h-6" />,
      unlocked: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary-400" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.code}
              className={`p-4 rounded-lg border transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                  : 'bg-gray-800/50 border-gray-700 opacity-60'
              }`}
            >
              <div className={`mb-2 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                {achievement.icon}
              </div>
              <h4 className={`font-semibold text-sm mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                {achievement.name}
              </h4>
              <p className={`text-xs ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                {achievement.description}
              </p>
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-yellow-400/70 mt-2">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

