'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendingUp, Clock, Target, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Stats {
  todayPomodoros: number
  todayFocusMinutes: number
  streak: number
  weeklyGoal: number
  weeklyCompleted: number
}

export function Statistics() {
  const [stats, setStats] = useState<Stats>({
    todayPomodoros: 0,
    todayFocusMinutes: 0,
    streak: 0,
    weeklyGoal: 20,
    weeklyCompleted: 0,
  })

  useEffect(() => {
    // Fetch stats from API (would need to create this endpoint)
    // For now, using mock data
    setStats({
      todayPomodoros: 4,
      todayFocusMinutes: 100,
      streak: 7,
      weeklyGoal: 20,
      weeklyCompleted: 15,
    })
  }, [])

  const weeklyProgress = (stats.weeklyCompleted / stats.weeklyGoal) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg p-4 border border-primary-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary-400" />
              <p className="text-xs text-gray-400">Today</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.todayPomodoros}</p>
            <p className="text-xs text-gray-400">pomodoros</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400">Focus Time</p>
            </div>
            <p className="text-2xl font-bold text-white">{stats.todayFocusMinutes}</p>
            <p className="text-xs text-gray-400">minutes</p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-white">{stats.streak} days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Keep it up!</p>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-400" />
              <p className="text-sm text-gray-400">Weekly Goal</p>
            </div>
            <p className="text-sm font-medium text-white">
              {stats.weeklyCompleted} / {stats.weeklyGoal}
            </p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

