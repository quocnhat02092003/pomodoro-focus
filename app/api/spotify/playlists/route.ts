import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_USER_ID = 'temp-guest-user'

export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication
    const userId = DEFAULT_USER_ID

    const spotifyProfile = await prisma.spotifyProfile.findUnique({
      where: { userId: userId },
    })

    if (!spotifyProfile) {
      return NextResponse.json(
        { error: 'Spotify not connected' },
        { status: 400 }
      )
    }

    // Check if token is expired and refresh if needed
    let accessToken = spotifyProfile.accessToken
    if (new Date() >= spotifyProfile.tokenExpiresAt) {
      // Refresh token logic would go here
      // For now, return error
      return NextResponse.json(
        { error: 'Spotify token expired. Please reconnect.' },
        { status: 401 }
      )
    }

    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch playlists' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data.items)
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

