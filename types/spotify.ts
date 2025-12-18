export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  duration_ms: number
  uri: string
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description?: string
  images: Array<{ url: string }>
  owner: {
    display_name: string
  }
  tracks: {
    total: number
  }
  uri: string
}

export interface SpotifyAlbum {
  id: string
  name: string
  artists: Array<{ name: string }>
  images: Array<{ url: string }>
  release_date: string
  total_tracks: number
  uri: string
}

export interface SpotifyPlayerState {
  isPlaying: boolean
  currentTrack?: SpotifyTrack
  position: number
  duration: number
  volume: number
  device?: {
    id: string
    name: string
    type: string
  }
}

