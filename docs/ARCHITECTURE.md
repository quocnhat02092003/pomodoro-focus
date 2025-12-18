# 🏗️ Architecture Overview

## Feature Breakdown (MVP → Advanced)

### MVP (Minimum Viable Product)
1. **Pomodoro Timer**
   - Basic timer with Focus/Short Break/Long Break
   - Pause/Resume/Skip controls
   - Sound notifications
   - Web Worker for background execution

2. **Task Management**
   - Create, read, update, delete tasks
   - Assign tasks to Pomodoro sessions
   - Basic priority and status

3. **Spotify Integration**
   - OAuth login
   - Play/pause music
   - Basic playlist selection

4. **User Authentication**
   - NextAuth with Spotify OAuth
   - Session management

### Advanced Features
1. **Focus Mode**
   - Fullscreen UI
   - Tab switching detection
   - Lock mode

2. **Analytics**
   - Daily/weekly/monthly stats
   - Charts (line, bar, heatmap)
   - CSV export

3. **Gamification**
   - XP system
   - Level progression
   - Streaks
   - Achievements

### "Xịn" Features
1. **AI Assistant**
   - Focus pattern analysis
   - Personalized recommendations
   - Daily summaries

2. **Smart Music**
   - Auto-switch playlists
   - Volume fade
   - BPM-based Pomodoro timing

3. **Social Features**
   - Study rooms
   - Public profiles
   - Achievement sharing

## User Flow

### First Time User
1. Land on homepage → See hero section
2. Click "Get Started" → Redirect to auth
3. Sign in with Spotify → OAuth flow
4. Grant permissions → Redirect to dashboard
5. Onboarding tour → Create first task
6. Start first Pomodoro → Timer starts

### Returning User
1. Sign in → Dashboard loads
2. View tasks → Select task
3. Start Pomodoro → Timer + Music starts
4. Complete session → Stats update
5. View analytics → Check progress

### Focus Session Flow
1. Select task (optional)
2. Choose session type (Focus/Break)
3. Click Start → Timer begins
4. Music auto-plays (if enabled)
5. Focus mode activates (optional)
6. Timer completes → Sound notification
7. Auto-transition to break (if enabled)
8. Session saved → Stats updated

## Folder Structure (Next.js App Router)

```
pomodoro-focus/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/
│   │   └── callback/
│   ├── (dashboard)/              # Protected routes
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── page.tsx             # Dashboard home
│   │   ├── tasks/
│   │   ├── analytics/
│   │   └── settings/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   ├── tasks/
│   │   ├── pomodoro/
│   │   ├── spotify/
│   │   └── analytics/
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/                    # React components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── pomodoro/                 # Pomodoro feature
│   │   ├── Timer.tsx
│   │   ├── TimerControls.tsx
│   │   └── SessionSelector.tsx
│   ├── tasks/                    # Task feature
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskForm.tsx
│   ├── spotify/                  # Spotify feature
│   │   ├── Player.tsx
│   │   ├── PlaylistSelector.tsx
│   │   └── SpotifyAuth.tsx
│   ├── analytics/                # Analytics feature
│   │   ├── StatsCards.tsx
│   │   ├── Charts.tsx
│   │   └── Heatmap.tsx
│   └── layout/                   # Layout components
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── FocusMode.tsx
├── lib/                          # Utilities & configs
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # NextAuth config
│   ├── spotify.ts                # Spotify SDK wrapper
│   ├── utils.ts                  # Helper functions
│   └── constants.ts              # App constants
├── stores/                       # Zustand stores
│   ├── timer-store.ts
│   ├── task-store.ts
│   ├── spotify-store.ts
│   └── ui-store.ts
├── hooks/                        # Custom React hooks
│   ├── usePomodoro.ts
│   ├── useSpotify.ts
│   └── useFocusMode.ts
├── workers/                      # Web Workers
│   └── timer.worker.ts
├── types/                        # TypeScript types
│   ├── task.ts
│   ├── pomodoro.ts
│   └── spotify.ts
├── prisma/
│   └── schema.prisma
└── public/                       # Static assets
    ├── sounds/
    └── images/
```

## Database Schema (Prisma)

See `prisma/schema.prisma` for complete schema.

### Key Relationships:
- User → Tasks (1:N)
- User → PomodoroSessions (1:N)
- User → FocusStats (1:N)
- User → SpotifyProfile (1:1)
- Task → PomodoroSessions (1:N)
- User → Achievements (N:M via UserAchievement)

### Indexes:
- User.email (unique)
- Task.userId + status (composite)
- PomodoroSession.userId + createdAt (composite)
- FocusStat.userId + date (composite, unique)

## API Design

### Authentication
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/callback/spotify` - OAuth callback
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

### Tasks
- `GET /api/tasks` - List user tasks (query: status, priority)
- `POST /api/tasks` - Create task
- `GET /api/tasks/[id]` - Get task details
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/[id]/complete` - Complete task

### Pomodoro
- `POST /api/pomodoro/start` - Start session
- `POST /api/pomodoro/pause` - Pause session
- `POST /api/pomodoro/resume` - Resume session
- `POST /api/pomodoro/complete` - Complete session
- `GET /api/pomodoro/current` - Get current session
- `GET /api/pomodoro/history` - Get session history

### Spotify
- `GET /api/spotify/profile` - Get Spotify profile
- `GET /api/spotify/playlists` - List playlists
- `GET /api/spotify/search` - Search tracks/albums/playlists
- `POST /api/spotify/play` - Play track/playlist
- `POST /api/spotify/pause` - Pause playback
- `POST /api/spotify/volume` - Set volume
- `GET /api/spotify/recommendations` - Get recommended playlists

### Analytics
- `GET /api/analytics/stats` - Get stats (query: period)
- `GET /api/analytics/chart` - Get chart data (query: type, period)
- `GET /api/analytics/export` - Export CSV

## Spotify Integration Flow

### Initial Setup
1. User clicks "Connect Spotify"
2. Redirect to Spotify OAuth
3. User grants permissions (user-read-playback-state, user-modify-playback-state)
4. Callback receives authorization code
5. Exchange code for access_token + refresh_token
6. Store tokens in database (SpotifyProfile)
7. Initialize Spotify Web Playback SDK

### Playback Flow
1. User selects playlist/track
2. Frontend calls Spotify Web API to get track URIs
3. Initialize Web Playback SDK player
4. Transfer playback to Web Player
5. Play selected content
6. Listen to player state changes
7. Update UI accordingly

### Auto-play Logic
1. Pomodoro starts → Check if auto-play enabled
2. Get recommended playlist based on session type
3. Start playback
4. Pomodoro ends → Pause playback (if auto-pause enabled)

### Token Refresh
1. Check token expiry before API calls
2. If expired, use refresh_token to get new access_token
3. Update database with new tokens
4. Retry original request

## State Management Strategy

### Zustand Stores

#### Timer Store
```typescript
- session: PomodoroSession | null
- timeRemaining: number
- isRunning: boolean
- isPaused: boolean
- sessionType: SessionType
- actions: start, pause, resume, skip, complete
```

#### Task Store
```typescript
- tasks: Task[]
- selectedTask: Task | null
- filters: { status, priority, tag }
- actions: fetchTasks, createTask, updateTask, deleteTask, selectTask
```

#### Spotify Store
```typescript
- isConnected: boolean
- isPlaying: boolean
- currentTrack: Track | null
- deviceId: string | null
- volume: number
- actions: connect, disconnect, play, pause, setVolume, search
```

#### UI Store
```typescript
- focusMode: boolean
- sidebarOpen: boolean
- theme: 'light' | 'dark'
- actions: toggleFocusMode, toggleSidebar, setTheme
```

## UI Wireframe (Text)

### Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│ Header: Logo | Nav | User Menu | Settings      │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │  Main Content Area                  │
│          │                                      │
│ - Tasks  │  ┌──────────────────────────────┐   │
│ - Timer  │  │  Pomodoro Timer (Large)     │   │
│ - Stats  │  │  [25:00]                     │   │
│ - Music  │  │  [Start] [Pause] [Skip]      │   │
│          │  └──────────────────────────────┘   │
│          │                                      │
│          │  ┌──────────────────────────────┐   │
│          │  │  Current Task               │   │
│          │  │  [Task Card]                │   │
│          │  └──────────────────────────────┘   │
│          │                                      │
│          │  ┌──────────────────────────────┐   │
│          │  │  Quick Stats                 │   │
│          │  │  Today: 4 pomodoros          │   │
│          │  │  Streak: 7 days              │   │
│          │  └──────────────────────────────┘   │
└──────────┴──────────────────────────────────────┘
```

### Focus Mode
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│              [25:00]                            │
│                                                 │
│         Focus Session                           │
│                                                 │
│         "Complete task X"                      │
│                                                 │
│                                                 │
│         [Pause]              [Skip]             │
│                                                 │
│                                                 │
│         🎵 Now Playing: Lofi Hip Hop           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Task Management
```
┌─────────────────────────────────────────────────┐
│ Tasks                              [+ New Task] │
├─────────────────────────────────────────────────┤
│ Filters: [All] [Todo] [In Progress] [Done]     │
├─────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐ │
│ │ 📋 Task Title                    [High]   │ │
│ │ Description...                            │ │
│ │ Tags: #work #urgent                        │ │
│ │ Pomodoros: ████░░ (2/5)                   │ │
│ │ [Start Pomodoro]                          │ │
│ └───────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────┐ │
│ │ 📋 Another Task                  [Medium] │ │
│ │ ...                                        │ │
│ └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Roadmap Expansion

### Phase 1: MVP (Weeks 1-2)
- Basic Pomodoro timer
- Task CRUD
- Spotify OAuth + basic playback
- User authentication

### Phase 2: Core Features (Weeks 3-4)
- Focus mode
- Analytics dashboard
- Gamification basics
- Auto-play/pause

### Phase 3: Advanced (Weeks 5-6)
- AI assistant integration
- Smart music mode
- Advanced analytics
- Achievement system

### Phase 4: Polish (Weeks 7-8)
- Performance optimization
- Mobile responsiveness
- Accessibility improvements
- Testing

### Phase 5: Social (Optional)
- Study rooms
- Public profiles
- Achievement sharing

## Security & Performance Notes

### Security
1. **Authentication**
   - Use NextAuth.js for secure session management
   - Store refresh tokens securely (encrypted)
   - Implement CSRF protection

2. **API Security**
   - Validate all inputs (Zod schemas)
   - Rate limiting on API routes
   - User authorization checks on all endpoints

3. **Spotify Tokens**
   - Never expose access tokens to client
   - Use server-side proxy for Spotify API calls
   - Implement token refresh mechanism

4. **Database**
   - Use parameterized queries (Prisma handles this)
   - Index frequently queried fields
   - Regular backups

### Performance
1. **Frontend**
   - Code splitting with Next.js dynamic imports
   - Image optimization (next/image)
   - Lazy load charts and heavy components
   - Web Worker for timer (non-blocking)

2. **Backend**
   - Database query optimization
   - Redis caching for stats (optional)
   - API response caching where appropriate
   - Server-side rendering for initial load

3. **Spotify**
   - Cache playlist data
   - Batch API requests
   - Use Web Playback SDK (client-side) to reduce server load

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Analytics

