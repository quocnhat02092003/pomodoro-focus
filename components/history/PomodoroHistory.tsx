'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { History, Clock, CheckCircle2 } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import { format } from 'date-fns'

interface PomodoroSession {
  id: string
  type: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'
  duration: number
  completedAt: string
  status: string
}

export function PomodoroHistory() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      // This would fetch from API endpoint /api/pomodoro/history
      // For now, using mock data
      const mockSessions: PomodoroSession[] = [
        {
          id: '1',
          type: 'FOCUS',
          duration: 25 * 60,
          completedAt: new Date().toISOString(),
          status: 'COMPLETED',
        },
        {
          id: '2',
          type: 'SHORT_BREAK',
          duration: 5 * 60,
          completedAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'COMPLETED',
        },
      ]
      setSessions(mockSessions)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'FOCUS':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'SHORT_BREAK':
        return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'LONG_BREAK':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getSessionLabel = (type: string) => {
    switch (type) {
      case 'FOCUS':
        return 'Focus Session'
      case 'SHORT_BREAK':
        return 'Short Break'
      case 'LONG_BREAK':
        return 'Long Break'
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary-400" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No sessions yet</p>
            <p className="text-sm mt-2">Complete your first pomodoro to see it here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${getSessionColor(session.type)}`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <div>
                    <p className="font-medium">{getSessionLabel(session.type)}</p>
                    <p className="text-xs opacity-70">
                      {format(new Date(session.completedAt), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 opacity-70" />
                  <span className="font-medium">{formatTime(session.duration)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

