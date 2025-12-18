import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const DEFAULT_USER_ID = 'temp-guest-user'

const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  estimatedPomodoros: z.number().int().positive().optional(),
  dueDate: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication
    const userId = DEFAULT_USER_ID

    // Ensure default user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const tag = searchParams.get('tag')

    const where: any = {
      userId: userId,
    }

    if (status) {
      where.status = status
    }
    if (priority) {
      where.priority = priority
    }
    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        tags: true,
        checklistItems: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled authentication
    const userId = DEFAULT_USER_ID

    // Ensure default user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    const body = await request.json()
    const validatedData = taskSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        userId: userId,
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority || 'MEDIUM',
        estimatedPomodoros: validatedData.estimatedPomodoros || 1,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      },
      include: {
        tags: true,
        checklistItems: true,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

