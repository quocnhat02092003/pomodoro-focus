"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Music } from "lucide-react";

interface Station {
  id: string;
  name: string;
  description: string;
  emoji: string;
  /**
   * "video" = a single video or a 24/7 live stream (uses the video id).
   * "playlist" = a YouTube playlist (uses the list id).
   */
  kind: "video" | "playlist";
  /** YouTube video id (kind="video") or playlist id (kind="playlist"). */
  youtubeId: string;
}

// Curated focus stations. All play full-length audio for free on YouTube.
// To swap one: open the video/playlist on YouTube and copy the id from the URL
//   video    -> youtube.com/watch?v=<VIDEO_ID>
//   playlist -> youtube.com/playlist?list=<PLAYLIST_ID>
const STATIONS: Station[] = [
  {
    id: "lofi",
    name: "LoFi Concentration",
    description: "Lofi Girl – beats to relax/study to (24/7 live)",
    emoji: "🎧",
    kind: "video",
    youtubeId: "X4VbdwhkE10",
  },
  {
    id: "jazzy",
    name: "Jazzy LoFi",
    description: "Chillhop – jazzy & lofi hip hop beats (24/7 live)",
    emoji: "🐾",
    kind: "video",
    youtubeId: "5yx6BWlEVcY",
  },
  {
    id: "sleep",
    name: "Chill & Sleep",
    description: "Lofi Girl – beats to sleep/chill to (24/7 live)",
    emoji: "💤",
    kind: "video",
    youtubeId: "VAlMDl00mYY",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    description:
      "Lofi Girl – synthwave radio, beats to chill/game to (24/7 live)",
    emoji: "🌌",
    kind: "video",
    youtubeId: "4xDzrJKXOOY",
  },
  {
    id: "piano",
    name: "Peaceful Piano",
    description: "Relaxing piano music (24/7 live)",
    emoji: "🎹",
    kind: "video",
    youtubeId: "N0snMcR6aaA",
  },
];

function buildEmbedUrl(station: Station): string {
  const base = "https://www.youtube-nocookie.com/embed";
  // rel=0 keeps related videos limited to the same channel.
  if (station.kind === "playlist") {
    return `${base}/videoseries?list=${station.youtubeId}&rel=0`;
  }
  return `${base}/${station.youtubeId}?rel=0`;
}

export function MusicPlayer() {
  const [selected, setSelected] = useState<Station>(STATIONS[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary-400" />
          Focus Music
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Station selector */}
        <div className="flex flex-wrap gap-2">
          {STATIONS.map((station) => {
            const isActive = selected.id === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setSelected(station)}
                title={station.description}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "border-primary-500/50 bg-primary-500/20 text-primary-700 dark:text-primary-300"
                    : "border-gray-200 bg-gray-100 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span>{station.emoji}</span>
                <span>{station.name}</span>
              </button>
            );
          })}
        </div>

        {/* YouTube player (full-length playback, free) */}
        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          <iframe
            key={selected.id}
            title={`Music player – ${selected.name}`}
            src={buildEmbedUrl(selected)}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {selected.description} · Powered by YouTube · Full-length playback,
          free.
        </p>
      </CardContent>
    </Card>
  );
}
