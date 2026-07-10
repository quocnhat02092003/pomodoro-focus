# Pomodoro Focus - Deep Work Timer

A modern Pomodoro timer with Google sign-in, task management, relaxing sounds, and analytics.

## Features

- **Pomodoro Timer** - Focus, short break, and long break sessions with customizable durations.
- **Task Management** - CRUD tasks with priorities, tags, deadlines, and checklists.
- **Relaxing Sounds** - Ambient audio for focus sessions.
- **Analytics** - Focus-time statistics and charts.
- **Gamification** - XP, streaks, achievements, and progress tracking.

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM
- **Auth**: NextAuth.js with Google and GitHub OAuth
- **Audio**: Browser audio playback

## Installation

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run dev
```

## Environment Variables

See `.env.example` and `docs/SETUP.md` for required environment variables.

Required for deploy:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Google OAuth callback:

```text
https://your-domain.com/api/auth/callback/google
```

GitHub OAuth callback:

```text
https://your-domain.com/api/auth/callback/github
```

## Documentation

- `docs/SETUP.md`
- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
