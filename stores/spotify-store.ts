import { create } from 'zustand'
import { SpotifyTrack, SpotifyPlaylist, SpotifyAlbum } from '@/types/spotify'

interface SpotifyState {
  isConnected: boolean
  isPlaying: boolean
  currentTrack: SpotifyTrack | null
  currentPlaylist: SpotifyPlaylist | null
  deviceId: string | null
  volume: number
  playlists: SpotifyPlaylist[]
  autoPlay: boolean
  autoPause: boolean
  
  // Actions
  setConnected: (connected: boolean) => void
  setPlaying: (playing: boolean) => void
  setCurrentTrack: (track: SpotifyTrack | null) => void
  setCurrentPlaylist: (playlist: SpotifyPlaylist | null) => void
  setDeviceId: (deviceId: string | null) => void
  setVolume: (volume: number) => void
  setPlaylists: (playlists: SpotifyPlaylist[]) => void
  setAutoPlay: (enabled: boolean) => void
  setAutoPause: (enabled: boolean) => void
}

export const useSpotifyStore = create<SpotifyState>((set) => ({
  isConnected: false,
  isPlaying: false,
  currentTrack: null,
  currentPlaylist: null,
  deviceId: null,
  volume: 50,
  playlists: [],
  autoPlay: true,
  autoPause: true,

  setConnected: (connected) => set({ isConnected: connected }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setVolume: (volume) => set({ volume }),
  setPlaylists: (playlists) => set({ playlists }),
  setAutoPlay: (enabled) => set({ autoPlay: enabled }),
  setAutoPause: (enabled) => set({ autoPause: enabled }),
}))

