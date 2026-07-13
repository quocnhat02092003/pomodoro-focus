<div align="center">

# 🍅 Pomodoro Focus

**A modern, full-featured Pomodoro productivity app** — timer, task management, analytics,
gamification, ambient entertainment, and a floating **Picture-in-Picture** countdown.

Built with Next.js 14 · TypeScript · Prisma · Zustand · Tailwind CSS

</div>

---

## ✨ Features

- ⏱️ **Pomodoro Timer** — Focus / Short Break / Long Break with a circular progress ring, pause, resume, skip, and configurable durations.
- 🪟 **Picture-in-Picture** — pop the countdown into a floating always-on-top window that keeps ticking accurately while you work in other tabs or apps. *(New!)*
- 🎯 **Focus Mode** — distraction-free fullscreen timer (`Ctrl/⌘ + F`).
- ✅ **Task Management** — create tasks with priority, tags, checklists, estimated pomodoros, and link them to focus sessions.
- 📊 **Statistics & Analytics** — daily focus minutes, completed pomodoros, and streaks (Recharts).
- 🏆 **Gamification** — XP, levels, streaks, and achievements.
- 🎵 **Entertainment & Relaxation** — breathing exercises, mini-games, jokes & quotes, and relaxing ambient sounds.
- ⌨️ **Keyboard Shortcuts** — control the timer without touching the mouse.
- 🌗 **Light / Dark theme** and a responsive, mobile-friendly layout.
- 🔐 **Authentication** via Google & GitHub (NextAuth).

---

## 🪟 Picture-in-Picture (highlight)

Click the **Picture-in-Picture** button on the timer to detach the countdown into a small
floating window. It renders the live timer onto a `<canvas>`, streams it into a hidden
`<video>`, and uses the browser's native `requestPictureInPicture()` API — so it stays on top
of every other window and remains accurate even when the tab is throttled in the background.

- ✅ Works in Chrome, Edge, Opera, and Safari.
- 🚫 The button is hidden automatically in browsers that don't support it (e.g. Firefox).

📖 Full technical write-up: **[docs/PICTURE_IN_PICTURE.md](docs/PICTURE_IN_PICTURE.md)**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| State | [Zustand](https://github.com/pmndrs/zustand) |
| Database / ORM | MySQL + [Prisma](https://www.prisma.io/) |
| Auth | [NextAuth](https://next-auth.js.org/) (Google / GitHub) |
| Charts | Recharts |
| Validation | Zod |
| Icons | lucide-react |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A MySQL database

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env        # then fill in the values

# 3. Set up the database
npm run db:generate         # generate Prisma client
npm run db:push             # push schema to your database

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

### Required environment variables

```env
DATABASE_URL=                 # MySQL connection string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=              # openssl rand -base64 32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

OAuth callback URLs:

```text
https://your-domain.com/api/auth/callback/google
https://your-domain.com/api/auth/callback/github
```

📖 Full setup (OAuth apps, production, troubleshooting): **[docs/SETUP.md](docs/SETUP.md)**

---

## 📜 npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to the database |
| `npm run db:migrate` | Create & apply a migration |
| `npm run db:studio` | Open Prisma Studio |

---

## 📁 Project Structure

```
pomodoro-focus/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/[...nextauth]/
│   │   ├── pomodoro/         # start, complete
│   │   └── tasks/            # CRUD
│   └── dashboard/            # Main app page
├── components/               # React components
│   ├── pomodoro/             # Timer, FocusMode
│   ├── tasks/                # Task list, card, form
│   ├── dashboard/            # Statistics, DailyGoals
│   ├── entertainment/        # Breathing, games, sounds, jokes
│   └── achievements/ · history/ · breaks/ · layout/ · ui/
├── hooks/                    # usePomodoro, usePictureInPicture, useSound, ...
├── stores/                   # Zustand: timer-store, task-store, ui-store
├── workers/                  # timer.worker.ts (background timer)
├── lib/                      # prisma, utils, constants
├── prisma/schema.prisma      # Database schema
├── types/                    # Shared TypeScript types
└── docs/                     # Architecture, API, PiP, Setup docs
```

---

## 🔌 API Overview

All routes live under `/api` and return JSON.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/pomodoro/start` | Start a session (`FOCUS` / `SHORT_BREAK` / `LONG_BREAK`) |
| `POST` | `/api/pomodoro/complete` | Complete a session, roll up stats & XP |
| `GET` | `/api/tasks` | List tasks (filter by `status`, `priority`, `tag`) |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/:id` | Get a task |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handler |

> **Note:** Picture-in-Picture is **100% client-side** — it has no API endpoint or database model.

📖 Endpoints, models & flows: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** · **[docs/API.md](docs/API.md)**

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Pause / Resume |
| `1` / `2` / `3` | Focus / Short Break / Long Break |
| `S` | Skip session |
| `Ctrl/⌘ + F` | Toggle Focus Mode |
| `Esc` | Exit Focus Mode |

---

## 📚 Documentation

- [Architecture — API, Models & Flows](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Picture-in-Picture Feature Flow](docs/PICTURE_IN_PICTURE.md)
- [Setup Guide](docs/SETUP.md)
- [Design Decisions](docs/DECISIONS.md)

---

## 🚢 Deployment

Deploy on **[Vercel](https://vercel.com/)** (recommended): push to GitHub, import the project,
add the environment variables, and deploy. Use a managed MySQL provider such as PlanetScale,
Railway, or Aiven for the database. See [docs/SETUP.md](docs/SETUP.md) for details.

---

<div align="center">

Made with 🍅 and focus.

</div>
