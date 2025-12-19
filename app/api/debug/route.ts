import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Test database connection
        const userCount = await prisma.user.count()
        const accountCount = await prisma.account.count()
        const sessionCount = await prisma.session.count()

        // Check env variables (without exposing secrets)
        const envCheck = {
            NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET (length: ' + process.env.NEXTAUTH_SECRET.length + ')' : 'NOT SET',
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
            SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ? 'SET' : 'NOT SET',
            SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ? 'SET' : 'NOT SET',
            DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
        }

        return NextResponse.json({
            status: 'ok',
            database: {
                connected: true,
                users: userCount,
                accounts: accountCount,
                sessions: sessionCount,
            },
            env: envCheck,
            expectedCallbacks: {
                google: (process.env.NEXTAUTH_URL || 'http://localhost:3000') + '/api/auth/callback/google',
                spotify: (process.env.NEXTAUTH_URL || 'http://localhost:3000') + '/api/auth/callback/spotify',
            },
        })
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 })
    }
}
