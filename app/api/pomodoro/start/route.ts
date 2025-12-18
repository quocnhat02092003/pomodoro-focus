import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { POMODORO_DURATIONS } from '@/lib/constants'

const DEFAULT_USER_ID = 'temp-guest-user'

const startSessionSchema = z.object({
  type: z.enum(['FOCUS', 'SHORT_BREAK', 'LONG_BREAK']),
  taskId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled authentication
    const userId = DEFAULT_USER_ID

    const body = await request.json()
    const { type, taskId } = startSessionSchema.parse(body)

    const durations = {
      FOCUS: POMODORO_DURATIONS.FOCUS,
      SHORT_BREAK: POMODORO_DURATIONS.SHORT_BREAK,
      LONG_BREAK: POMODORO_DURATIONS.LONG_BREAK,
    }

    // Ensure default user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    // Cancel any existing running session
    await prisma.pomodoroSession.updateMany({
      where: {
        userId: userId,
        status: 'RUNNING',
      },
      data: {
        status: 'CANCELLED',
      },
    })

    const session_record = await prisma.pomodoroSession.create({
      data: {
        userId: userId,
        taskId: taskId || null,
        type,
        duration: durations[type],
        remainingTime: durations[type],
        status: 'RUNNING',
        startedAt: new Date(),
      },
    })

    return NextResponse.json(session_record)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error starting pomodoro session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

