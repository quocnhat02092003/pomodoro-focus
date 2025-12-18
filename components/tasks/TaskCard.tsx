'use client'

import { Task } from '@/types/task'
import { Card } from '@/components/ui/Card'
import { PRIORITY_COLORS } from '@/lib/constants'
import { useTaskStore } from '@/stores/task-store'
import { useTimerStore } from '@/stores/timer-store'
import { Play, Edit2, Trash2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface TaskCardProps {
  task: Task
  onEdit?: () => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { selectTask } = useTaskStore()
  const { setSessionType, start } = useTimerStore()

  const handleStartPomodoro = () => {
    selectTask(task)
    setSessionType('FOCUS')
  }

  const handleComplete = async () => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })
      // Refresh tasks
      window.location.reload()
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })
      // Refresh tasks
      window.location.reload()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const progress = task.estimatedPomodoros > 0
    ? (task.completedPomodoros / task.estimatedPomodoros) * 100
    : 0

  return (
    <Card className={`hover:bg-gray-800/50 transition-all ${task.status === 'COMPLETED' ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {task.status === 'COMPLETED' && (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
            <h3 className={`text-lg font-semibold ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-white'}`}>
              {task.title}
            </h3>
            <span
              className="px-2 py-1 text-xs font-medium rounded"
              style={{
                backgroundColor: `${PRIORITY_COLORS[task.priority]}20`,
                color: PRIORITY_COLORS[task.priority],
              }}
            >
              {task.priority}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded bg-gray-700 text-gray-300">
              {task.status}
            </span>
          </div>

          {task.description && (
            <p className="text-gray-400 text-sm mb-3">{task.description}</p>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {task.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs rounded"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {task.estimatedPomodoros > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>
                  {task.completedPomodoros} / {task.estimatedPomodoros}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {task.status !== 'COMPLETED' && (
            <Button
              onClick={handleStartPomodoro}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              title="Start Pomodoro"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {task.status === 'COMPLETED' ? (
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-red-400 hover:text-red-300"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-green-400 hover:text-green-300"
              title="Complete Task"
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

