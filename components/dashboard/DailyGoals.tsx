'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Target, CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'

interface Goal {
  id: string
  text: string
  completed: boolean
}

export function DailyGoals() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', text: 'Complete 4 pomodoros', completed: false },
    { id: '2', text: 'Finish project task', completed: false },
    { id: '3', text: 'Take 3 breaks', completed: false },
  ])

  const toggleGoal = (id: string) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ))
  }

  const completedCount = goals.filter(g => g.completed).length
  const progress = (completedCount / goals.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-400" />
          Daily Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {completedCount} / {goals.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-2">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${goal.completed
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              {goal.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <span
                className={`text-sm flex-1 text-left ${goal.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'
                  }`}
              >
                {goal.text}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

