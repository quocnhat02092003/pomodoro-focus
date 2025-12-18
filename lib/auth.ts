import { NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import type { SpotifyProfile } from 'next-auth/providers/spotify'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { SPOTIFY_SCOPES } from './constants'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: SPOTIFY_SCOPES.join(' '),
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Fetch Spotify profile if exists
        const spotifyProfile = await prisma.spotifyProfile.findUnique({
          where: { userId: user.id },
        })
        
        if (spotifyProfile) {
          session.spotify = {
            id: spotifyProfile.spotifyId,
            accessToken: spotifyProfile.accessToken,
            refreshToken: spotifyProfile.refreshToken,
            tokenExpiresAt: spotifyProfile.tokenExpiresAt,
          }
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'spotify' && account.access_token && account.refresh_token) {
        const spotifyProfile = profile as SpotifyProfile | undefined
        if (!spotifyProfile?.id) {
          return true
        }

        await prisma.spotifyProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            spotifyId: spotifyProfile.id,
            displayName: spotifyProfile.display_name ?? null,
            email: spotifyProfile.email ?? null,
            image: spotifyProfile.images?.[0]?.url ?? null,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            tokenExpiresAt: account.expires_at
              ? new Date(account.expires_at * 1000)
              : new Date(Date.now() + 3600 * 1000),
          },
          update: {
            spotifyId: spotifyProfile.id,
            displayName: spotifyProfile.display_name ?? null,
            email: spotifyProfile.email ?? null,
            image: spotifyProfile.images?.[0]?.url ?? null,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            tokenExpiresAt: account.expires_at
              ? new Date(account.expires_at * 1000)
              : new Date(Date.now() + 3600 * 1000),
          },
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
}

