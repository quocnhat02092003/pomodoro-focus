import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateXP } from '@/lib/utils'

const DEFAULT_USER_ID = 'temp-guest-user'

export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled authentication
    const userId = DEFAULT_USER_ID

    const body = await request.json()
    const { sessionId } = body

    const pomodoroSession = await prisma.pomodoroSession.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
    })

    if (!pomodoroSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Update session
    const completedSession = await prisma.pomodoroSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        remainingTime: 0,
      },
    })

    // Update task if associated
    if (pomodoroSession.taskId && pomodoroSession.type === 'FOCUS') {
      await prisma.task.update({
        where: { id: pomodoroSession.taskId },
        data: {
          completedPomodoros: {
            increment: 1,
          },
        },
      })
    }

    // Update focus stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const focusMinutes =
      (pomodoroSession.duration - pomodoroSession.remainingTime) / 60

    if (pomodoroSession.type === 'FOCUS') {
      const xp = calculateXP(
        pomodoroSession.duration - pomodoroSession.remainingTime,
        'FOCUS'
      )

      await prisma.focusStat.upsert({
        where: {
          userId_date: {
            userId: userId,
            date: today,
          },
        },
        create: {
          userId: userId,
          date: today,
          focusMinutes: Math.floor(focusMinutes),
          completedPomodoros: 1,
          xp,
        },
        update: {
          focusMinutes: {
            increment: Math.floor(focusMinutes),
          },
          completedPomodoros: {
            increment: 1,
          },
          xp: {
            increment: xp,
          },
        },
      })
    }

    return NextResponse.json(completedSession)
  } catch (error) {
    console.error('Error completing pomodoro session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

