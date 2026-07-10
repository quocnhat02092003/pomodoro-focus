# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MySQL database
- Google Cloud Console project

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
- `DATABASE_URL`: MySQL connection string
- `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `GITHUB_CLIENT_ID`: From GitHub OAuth App settings
- `GITHUB_CLIENT_SECRET`: From GitHub OAuth App settings

Optional:
- `REDIS_URL`: For caching (optional)
- `OPENAI_API_KEY`: For AI features (optional)

### 3. Set Up Google OAuth

1. Go to Google Cloud Console
2. Create an OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env`
5. For production, add `https://your-domain.com/api/auth/callback/google`

### 4. Set Up GitHub OAuth

1. Go to GitHub Developer settings
2. Create a new OAuth App
3. Add callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`
5. For production, add `https://your-domain.com/api/auth/callback/github`

### 5. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or create migration
npm run db:migrate
```

### 6. Run Development Server

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

For production, use a managed MySQL service:
- PlanetScale
- Railway
- AWS RDS
- Aiven

### Environment Variables for Production

Update `NEXTAUTH_URL` to your production domain.

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` format
- Check database is accessible
- Ensure Prisma schema matches database

### Authentication Issues

- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Verify OAuth redirect URIs

