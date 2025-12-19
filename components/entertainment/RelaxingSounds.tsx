"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Volume2, VolumeX, Pause } from "lucide-react";

interface Sound {
  id: string;
  name: string;
  emoji: string;
  url: string;
}

const SOUNDS: Sound[] = [
  {
    id: "rain",
    name: "Rain",
    emoji: "🌧️",
    url: "https://cdn.pixabay.com/audio/2025/11/29/audio_04e9ec42a3.mp3",
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    emoji: "🌊",
    url: "https://cdn.pixabay.com/audio/2024/10/12/audio_7dd52a2e33.mp3",
  },
  {
    id: "forest",
    name: "Forest",
    emoji: "🌲",
    url: "https://cdn.pixabay.com/audio/2025/02/03/audio_7599bcb342.mp3",
  },
  {
    id: "fireplace",
    name: "Fireplace",
    emoji: "🔥",
    url: "https://cdn.pixabay.com/audio/2021/08/04/audio_d412a79df9.mp3",
  },
  {
    id: "birds",
    name: "Birds",
    emoji: "🐦",
    url: "https://cdn.pixabay.com/audio/2022/02/10/audio_7a07ee0e79.mp3",
  },
  {
    id: "cafe",
    name: "Coffee Shop",
    emoji: "☕",
    url: "https://cdn.pixabay.com/audio/2022/02/07/audio_6872fe6dc2.mp3",
  },
];

export function RelaxingSounds() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const volumeRef = useRef(volume);

  useEffect(() => {
    SOUNDS.forEach((sound) => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = volumeRef.current;
        audioRefs.current[sound.id] = audio;
      }
    });

    const currentAudios = audioRefs.current;

    return () => {
      Object.values(currentAudios).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  useEffect(() => {
    volumeRef.current = volume;
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = volume;
    });
  }, [volume]);

  const toggleSound = (soundId: string) => {
    const audio = audioRefs.current[soundId];
    if (!audio) return;

    if (playingId === soundId) {
      audio.pause();
      setPlayingId(null);
    } else {
      Object.values(audioRefs.current).forEach((a) => a.pause());
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
      setPlayingId(soundId);
    }
  };

  const stopAll = () => {
    Object.values(audioRefs.current).forEach((audio) => audio.pause());
    setPlayingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-primary-400" />
          Relaxing Sounds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {SOUNDS.map((sound) => {
            const isPlaying = playingId === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`p-4 rounded-lg border transition-all ${
                  isPlaying
                    ? "bg-primary-500/20 border-primary-500/50"
                    : "bg-gray-800 border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="text-3xl mb-2">{sound.emoji}</div>
                <div className="text-sm text-white font-medium">
                  {sound.name}
                </div>
                {isPlaying && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-primary-400">
                    <div className="w-1 h-4 bg-current animate-pulse"></div>
                    <div
                      className="w-1 h-6 bg-current animate-pulse"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-4 bg-current animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
          <VolumeX className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1"
          />
          <Volume2 className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400 w-8">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {playingId && (
          <Button
            onClick={stopAll}
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center"
          >
            <Pause className="w-4 h-4 mr-2" />
            Stop All
          </Button>
        )}

        <p className="text-xs text-gray-500 text-center">
          Note: Sounds require internet connection. Replace URLs with your own
          audio files.
        </p>
      </CardContent>
    </Card>
  );
}
