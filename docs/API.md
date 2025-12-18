# API Documentation

## Authentication

All protected endpoints require authentication via NextAuth session.

## Tasks API

### GET /api/tasks
Get all tasks for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (TODO, IN_PROGRESS, COMPLETED, ARCHIVED)
- `priority` (optional): Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `tag` (optional): Filter by tag name

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "priority": "MEDIUM",
    "status": "TODO",
    "estimatedPomodoros": 1,
    "completedPomodoros": 0,
    "dueDate": "2024-01-01T00:00:00Z",
    "tags": [],
    "checklistItems": []
  }
]
```

### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)",
  "priority": "MEDIUM (optional)",
  "estimatedPomodoros": 1,
  "dueDate": "2024-01-01T00:00:00Z (optional)"
}
```

### GET /api/tasks/[id]
Get a specific task by ID.

### PATCH /api/tasks/[id]
Update a task.

**Request Body:** (all fields optional)
```json
{
  "title": "string",
  "description": "string",
  "priority": "MEDIUM",
  "status": "TODO",
  "estimatedPomodoros": 1,
  "completedPomodoros": 0,
  "dueDate": "2024-01-01T00:00:00Z"
}
```

### DELETE /api/tasks/[id]
Delete a task.

## Pomodoro API

### POST /api/pomodoro/start
Start a new Pomodoro session.

**Request Body:**
```json
{
  "type": "FOCUS | SHORT_BREAK | LONG_BREAK",
  "taskId": "string (optional)"
}
```

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "taskId": "string | null",
  "type": "FOCUS",
  "duration": 1500,
  "remainingTime": 1500,
  "status": "RUNNING",
  "startedAt": "2024-01-01T00:00:00Z"
}
```

### POST /api/pomodoro/complete
Complete a Pomodoro session.

**Request Body:**
```json
{
  "sessionId": "string"
}
```

## Spotify API

### GET /api/spotify/playlists
Get user's Spotify playlists.

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "images": [{"url": "string"}],
      "tracks": {"total": 0}
    }
  ]
}
```

