"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSpotify } from "@/hooks/useSpotify";
import { useSpotifyStore } from "@/stores/spotify-store";
import { Card } from "@/components/ui/Card";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function SpotifyPlayer() {
  const router = useRouter();
  const { status } = useSession();
  const {
    isConnected,
    isPlaying,
    currentTrack,
    volume,
    play,
    pause,
    setVolume,
  } = useSpotify();
  const { autoPlay, autoPause, setAutoPlay, setAutoPause } = useSpotifyStore();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    return (
      <Card className="text-center space-y-4">
        <p className="text-gray-300">
          Sign in to connect Spotify and unlock curated focus playlists.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="w-full"
          size="sm"
        >
          Go to login
        </Button>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card>
        <p className="text-gray-400 text-center">
          Connect Spotify to play music during your focus sessions
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {currentTrack && (
          <div className="flex items-center gap-4">
            {currentTrack.album.images[0] && (
              <Image
                src={currentTrack.album.images[0].url}
                alt={currentTrack.album.name}
                width={64}
                height={64}
                className="rounded-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {currentTrack.name}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {currentTrack.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
            <Button
              onClick={isPlaying ? pause : () => play(currentTrack.uri)}
              variant="ghost"
              size="sm"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-400 w-12 text-right">
            {volume}%
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              className="rounded"
            />
            Auto-play on start
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={autoPause}
              onChange={(e) => setAutoPause(e.target.checked)}
              className="rounded"
            />
            Auto-pause on break
          </label>
        </div>
      </div>
    </Card>
  );
}
