# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Spotify Developer Account (for Spotify integration)
- Google Cloud Console project (optional, for Google OAuth)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
cd pomodoro-focus
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `SPOTIFY_CLIENT_ID`: From Spotify Developer Dashboard
- `SPOTIFY_CLIENT_SECRET`: From Spotify Developer Dashboard

Optional:
- `GOOGLE_CLIENT_ID`: For Google OAuth
- `GOOGLE_CLIENT_SECRET`: For Google OAuth
- `REDIS_URL`: For caching (optional)
- `OPENAI_API_KEY`: For AI features (optional)

### 3. Set Up Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
4. Copy Client ID and Client Secret to `.env`
5. Note: For production, add production redirect URI

### 4. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or create migration
npm run db:migrate
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Setup

For production, use a managed PostgreSQL service:
- Vercel Postgres
- Supabase
- Railway
- AWS RDS

### Environment Variables for Production

Update `NEXTAUTH_URL` to your production domain.

## Troubleshooting

### Spotify Playback Not Working

- Ensure Spotify Premium account
- Check browser console for errors
- Verify Spotify app redirect URIs match your domain
- Check token expiration

### Database Connection Issues

- Verify `DATABASE_URL` format
- Check database is accessible
- Ensure Prisma schema matches database

### Authentication Issues

- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Verify OAuth redirect URIs

