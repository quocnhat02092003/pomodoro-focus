# 🍅 Pomodoro Focus - Deep Work Timer

A modern, full-featured Pomodoro timer application with Spotify integration, task management, and analytics.

## 🚀 Features

### Core Features
- ⏱️ **Pomodoro Timer** - Focus, Short Break, Long Break with customizable durations
- 📋 **Task Management** - CRUD tasks with priorities, tags, deadlines, and checklists
- 🎵 **Spotify Integration** - Play music during focus sessions with auto-play/pause
- 📊 **Analytics** - Track your focus time with detailed statistics and charts
- 🏆 **Gamification** - XP system, levels, streaks, and achievements

### Advanced Features
- 🧠 **Focus Mode** - Fullscreen distraction-free interface
- 🤖 **AI Assistant** - Personalized focus recommendations
- 🎶 **Smart Music** - Auto-switch playlists based on session type
- 🌍 **Social** - Study rooms and shared achievements (optional)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Backend**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (Spotify + Google OAuth)
- **Music**: Spotify Web Playback SDK

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

## 🔐 Environment Variables

See `.env.example` for required environment variables.

## 📚 Documentation

See `/docs` folder for detailed documentation:
- Architecture overview
- API documentation
- Database schema
- Spotify integration guide

