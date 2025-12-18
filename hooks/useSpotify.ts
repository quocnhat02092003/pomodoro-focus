import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSpotifyStore } from '@/stores/spotify-store'

declare global {
  interface Window {
    Spotify: any
    onSpotifyWebPlaybackSDKReady: () => void
  }
}

export function useSpotify() {
  const { data: session } = useSession()
  const {
    isConnected,
    deviceId,
    isPlaying,
    currentTrack,
    volume,
    setConnected,
    setDeviceId,
    setPlaying,
    setCurrentTrack,
    setVolume,
  } = useSpotifyStore()

  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!session?.spotify?.accessToken) {
      setConnected(false)
      return
    }

    // Load Spotify Web Playback SDK
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Pomodoro Focus',
        getOAuthToken: (cb: (token: string) => void) => {
          if (session?.spotify?.accessToken) {
            cb(session.spotify.accessToken)
          }
        },
        volume: volume / 100,
      })

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Spotify player ready', device_id)
        setDeviceId(device_id)
        setConnected(true)
      })

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Spotify player not ready', device_id)
        setConnected(false)
      })

      player.addListener('player_state_changed', (state: any) => {
        if (!state) return

        setPlaying(!state.paused)
        
        if (state.track_window?.current_track) {
          setCurrentTrack({
            id: state.track_window.current_track.id,
            name: state.track_window.current_track.name,
            artists: state.track_window.current_track.artists.map((a: any) => ({
              name: a.name,
            })),
            album: {
              name: state.track_window.current_track.album.name,
              images: state.track_window.current_track.album.images,
            },
            duration_ms: state.duration,
            uri: state.track_window.current_track.uri,
          })
        }
      })

      player.connect()
      playerRef.current = player
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect()
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [session?.spotify?.accessToken, setConnected, setCurrentTrack, setDeviceId, setPlaying, volume])

  const play = async (uri: string) => {
    if (!playerRef.current || !deviceId || !session?.spotify?.accessToken) return

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.spotify.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [uri],
        }),
      })
      setPlaying(true)
    } catch (error) {
      console.error('Error playing track:', error)
    }
  }

  const pause = async () => {
    if (!playerRef.current || !deviceId || !session?.spotify?.accessToken) return

    try {
      await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.spotify.accessToken}`,
        },
      })
      setPlaying(false)
    } catch (error) {
      console.error('Error pausing:', error)
    }
  }

  const setVolumeLevel = async (newVolume: number) => {
    if (!playerRef.current || !deviceId || !session?.spotify?.accessToken) return

    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}&device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${session.spotify.accessToken}`,
          },
        }
      )
      setVolume(newVolume)
    } catch (error) {
      console.error('Error setting volume:', error)
    }
  }

  return {
    isConnected,
    deviceId,
    isPlaying,
    currentTrack,
    volume,
    play,
    pause,
    setVolume: setVolumeLevel,
  }
}

